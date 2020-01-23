import {extend} from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import SessionDropdown from 'flarum/components/SessionDropdown';
import CreateUserModal from './modals/CreateUserModal';

/* global flarum */

app.initializers.add('clarkwinkelmann-create-user-modal', () => {
    const userDirectory = flarum.extensions['fof-user-directory'];

    function addButton(items) {
        if (!app.forum.attribute('clarkwinkelmannCreateUserModal')) {
            return;
        }

        items.add('clarkwinkelmann-create-user-modal', Button.component({
            children: app.translator.trans('clarkwinkelmann-create-user-modal.forum.link'),
            icon: 'fas fa-user-plus',
            className: 'Button',
            onclick: () => {
                app.modal.show(new CreateUserModal());
            },
        }), 10);
    }

    if (userDirectory && userDirectory.UserDirectoryPage) {
        extend(userDirectory.UserDirectoryPage.prototype, 'actionItems', addButton);
    } else {
        extend(SessionDropdown.prototype, 'items', addButton);
    }
});
