import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import SessionDropdown from 'flarum/forum/components/SessionDropdown';
import CreateUserModal from './modals/CreateUserModal';

/* global flarum */

app.initializers.add('clarkwinkelmann-create-user-modal', () => {
    const userDirectory = flarum.extensions['fof-user-directory'];

    function addButton(items) {
        if (!app.forum.attribute('clarkwinkelmannCreateUserModal')) {
            return;
        }

        items.add('clarkwinkelmann-create-user-modal', Button.component({
            icon: 'fas fa-user-plus',
            className: 'Button',
            onclick: () => {
                app.modal.show(CreateUserModal);
            },
        }, app.translator.trans('clarkwinkelmann-create-user-modal.forum.link')), 10);
    }

    if (userDirectory && userDirectory.UserDirectoryPage) {
        extend(userDirectory.UserDirectoryPage.prototype, 'actionItems', addButton);
    } else {
        extend(SessionDropdown.prototype, 'items', addButton);
    }
});
