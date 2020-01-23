import app from 'flarum/app';
import SignUpModal from 'flarum/components/SignUpModal';

export default class CreateUserModal extends SignUpModal {
    title() {
        return app.translator.trans('clarkwinkelmann-create-user-modal.forum.modal.title');
    }

    fields() {
        const items = super.fields();

        if (items.has('submit')) {
            const vdom = items.get('submit');

            if (vdom && Array.isArray(vdom.children) && vdom.children.length > 0 && vdom.children[0] && vdom.children[0].props) {
                vdom.children[0].props.children = [
                    app.translator.trans('clarkwinkelmann-create-user-modal.forum.modal.submit'),
                ];
            }
        }

        return items;
    }

    // Hide the footer completely
    footer() {
        return null;
    }

    // Instead of hitting /register (which would change which user is connected in this session)
    // We just hit the API that's already used behind the scenes when registering
    // Doing it this way skips connecting the new account and just returns the new user data
    onsubmit(e) {
        e.preventDefault();

        this.loading = true;

        app.request({
            url: app.forum.attribute('apiUrl') + '/users',
            method: 'POST',
            data: {
                data: {
                    attributes: this.submitData(),
                },
            },
            errorHandler: this.onerror.bind(this)
        }).then(
            payload => {
                const user = app.store.pushPayload(payload);

                // Add the missing groups relationship we can't include from the CreateUserController
                // Without this there's an error trying to access the user edit modal just after the redirect to the profile
                user.pushData({
                    relationships: {
                        groups: {
                            data: [],
                        },
                    },
                });

                m.route(app.route.user(user));
            },
            this.loaded.bind(this)
        );
    }
}
