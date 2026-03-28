import { db } from "@/config/db.js";
import { user } from "@/db/schema/auth.js";
import { userRoles, roles } from "@/db/schema/rbac.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";

export const UserService = {
  async create(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuid(),
      name,
      email,
      password: hashedPassword,
    };

    await db.insert(user).values(newUser);

    return {
      id: newUser.id,
      name,
      email,
      roles: [],
    };
  },

  // 🔥 GET ALL USERS WITH ROLES
  async getAll() {
    const usersData = await db.select().from(user);

    const result = await Promise.all(
      usersData.map(async (u) => {
        const userRolesData = await db
          .select({
            id: roles.id,
            name: roles.name,
          })
          .from(userRoles)
          .innerJoin(roles, eq(userRoles.roleId, roles.id))
          .where(eq(userRoles.userId, u.id));

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          emailVerified: u.emailVerified,
          image: u.image,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
          roles: userRolesData,
        };
      })
    );

    return result;
  },

  // 🔥 GET USER BY ID WITH ROLES
  async getById(id: string) {
    const result = await db
      .select()
      .from(user)
      .where(eq(user.id, id));

    if (!result[0]) return null;

    const u = result[0];

    const userRolesData = await db
      .select({
        id: roles.id,
        name: roles.name,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, id));

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      emailVerified: u.emailVerified,
      image: u.image,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      roles: userRolesData,
    };
  },

  async update(
    id: string,
    data: { name?: string; email?: string; password?: string }
  ) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await db.update(user).set(data).where(eq(user.id, id));

    return await UserService.getById(id); // 🔥 returns with roles
  },

  // ASSIGN MULTIPLE ROLES
  async assignRoles(userId: string, roleIds: string[]) {
    // 🧹 Step 1: remove old roles
    await db.delete(userRoles).where(eq(userRoles.userId, userId));

    // 🧱 Step 2: insert new roles
    if (roleIds.length > 0) {
      const values = roleIds.map((roleId) => ({
        userId,
        roleId,
      }));

      await db.insert(userRoles).values(values);
    }

    return { userId, roleIds };
  },

  // 🔥 ADD SINGLE ROLE
  async addRole(userId: string, roleId: string) {
    // prevent duplicate
    const existing = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId));

    const alreadyExists = existing.some((r) => r.roleId === roleId);

    if (alreadyExists) {
      return { userId, roleId, message: "Role already assigned" };
    }

    await db.insert(userRoles).values({
      userId,
      roleId,
    });

    return { userId, roleId };
  },

  // 🔥 REMOVE SINGLE ROLE
  async removeRole(userId: string, roleId: string) {
    await db
      .delete(userRoles)
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.roleId, roleId)
        )
      );

    return { userId, roleId };
  },

  async delete(id: string) {
    await db.delete(user).where(eq(user.id, id));
    return { id };
  },
};