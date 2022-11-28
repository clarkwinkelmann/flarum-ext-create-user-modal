import app from 'flarum/forum/app';
import {ApiPayloadSingle} from 'flarum/common/Store';
import User from 'flarum/common/models/User';
import SignUpModal from 'flarum/forum/components/SignUpModal';
import LogInButtons from 'flarum/forum/components/LogInButtons';

export default class CreateUserModal extends SignUpModal {
    title() {
        return app.translator.trans('clarkwinkelmann-create-user-modal.forum.modal.title');
    }

    className(): string {
        return super.className() + ' CreateUserModal';
    }

    content() {
        // Same as original but without .Modal-footer
        // We don't need to override the this.footer() method, it will just never be called
        return [
            m('.Modal-body', this.body()),
        ];
    }

    body(): (false | JSX.Element)[] {
        return super.body().filter(element => {
            // If the element is the LogInButtons, remove it
            if (element && element.tag === LogInButtons) {
                return false;
            }

            // Otherwise keep everything else verbatim, even null/false/etc
            return true;
        });
    }

    fields() {
        const items = super.fields();

        if (items.has('submit')) {
            const vdom: any = items.get('submit');

            if (vdom && Array.isArray(vdom.children) && vdom.children.length > 0 && vdom.children[0]) {
                vdom.children[0].children = [
                    app.translator.trans('clarkwinkelmann-create-user-modal.forum.modal.submit'),
                ];
            }
        }

        return items;
    }

    // Instead of hitting /register (which would change which user is connected in this session)
    // We just hit the API that's already used behind the scenes when registering
    // Doing it this way skips connecting the new account and just returns the new user data
    onsubmit(event: Event) {
        event.preventDefault();

        this.loading = true;

        app.request<ApiPayloadSingle>({
            url: app.forum.attribute('apiUrl') + '/users',
            method: 'POST',
            body: {
                data: {
                    attributes: this.submitData(),
                },
            },
            errorHandler: this.onerror.bind(this)
        }).then(
            payload => {
                const user = app.store.pushPayload<User>(payload);

                // Add the missing groups relationship we can't include from the CreateUserController
                // Without this there's an error trying to access the user edit modal just after the redirect to the profile
                user.pushData({
                    relationships: {
                        groups: {
                            data: [],
                        },
                    },
                });

                m.route.set(app.route.user(user));
            },
            this.loaded.bind(this)
        );
    }
}
