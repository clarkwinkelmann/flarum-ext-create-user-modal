import {extend, override} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import PermissionDropdown from 'flarum/components/PermissionDropdown';

app.initializers.add('clarkwinkelmann-create-user-modal', () => {
    extend(PermissionGrid.prototype, 'viewItems', function (items) {
        items.add('clarkwinkelmann-create-user-modal', {
            icon: 'fas fa-user-plus',
            label: app.translator.trans('clarkwinkelmann-create-user-modal.admin.permissions.view'),
            permission: 'clarkwinkelmann.createUserModal',
            allowGuest: true,
        });
    });

    override(PermissionDropdown.prototype, 'isGroupDisabled', function (original, id) {
        // If it's not our permission, let the normal flow continue
        if (this.attrs.permission !== 'clarkwinkelmann.createUserModal') {
            return original(id);
        }

        // If sign up is disabled, only show admin as a possible value for this permission
        // (the check for admin is hard-coded in RegisterUserHandler so it doesn't make sense to offer any other choice anyway)
        if (app.data.settings['allow_sign_up'] !== '1') {
            return true;
        }

        // If sign up is enabled, we can let the default behaviour happen (any option can be selected)
        return original(id);
    });
});
