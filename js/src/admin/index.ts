import {override} from 'flarum/common/extend';
import app from 'flarum/admin/app';
import PermissionDropdown from 'flarum/admin/components/PermissionDropdown';

app.initializers.add('clarkwinkelmann-create-user-modal', () => {
    app.extensionData
        .for('clarkwinkelmann-create-user-modal')
        .registerPermission({
            icon: 'fas fa-user-plus',
            label: app.translator.trans('clarkwinkelmann-create-user-modal.admin.permissions.view'),
            permission: 'clarkwinkelmann.createUserModal',
            allowGuest: true,
        }, 'view');

    override(PermissionDropdown.prototype, 'isGroupDisabled', function (original, id) {
        // If it's not our permission, let the normal flow continue
        if ((this.attrs as any).permission !== 'clarkwinkelmann.createUserModal') {
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
