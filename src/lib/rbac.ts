// src/lib/rbac.ts
import { authorize } from "@/middleware/authorize";
import { Module, BaseAction, UsersAction, PostsAction, SystemAction } from "@/constants/permissions";

type ModuleExtraActions = UsersAction | PostsAction | SystemAction;

type ActionMap = {
    [key: string]: ReturnType<typeof authorize>;
};

export const authFor = (module: Module): ActionMap => {
    const base = {
        CREATE: authorize(module, BaseAction.CREATE),
        READ: authorize(module, BaseAction.READ),
        UPDATE: authorize(module, BaseAction.UPDATE),
        DELETE: authorize(module, BaseAction.DELETE),
    };

    // Add extra module-specific actions dynamically
    if (module === Module.USERS) {
        return {
            ...base,
            BAN: authorize(module, UsersAction.BAN),
            IMPERSONATE: authorize(module, UsersAction.RAJNIKANTH),
        };
    }

    if (module === Module.POSTS) {
        return { ...base, PUBLISH: authorize(module, PostsAction.PUBLISH) };
    }

    if (module === Module.SYSTEM) {
        return { ...base, MAINTAINER: authorize(module, SystemAction.MAINTAINER) };
    }

    return base;
};