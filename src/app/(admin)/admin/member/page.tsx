import { asc, eq } from "drizzle-orm"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/db/client"
import { karyawanTable, roleTable } from "@/db/schema"

import {
  createKaryawan,
  createRole,
  deactivateKaryawan,
  updateKaryawan,
} from "./actions"

export const dynamic = "force-dynamic"

export default async function MemberPage() {
  const [karyawan, roles] = await Promise.all([
    db
      .select({
        idKaryawan: karyawanTable.idKaryawan,
        name: karyawanTable.name,
        contact: karyawanTable.contact,
        idRole: karyawanTable.idRole,
        roleName: roleTable.namaRole,
        status: karyawanTable.status,
      })
      .from(karyawanTable)
      .leftJoin(roleTable, eq(karyawanTable.idRole, roleTable.idRole))
      .orderBy(asc(karyawanTable.name)),
    db
      .select({
        idRole: roleTable.idRole,
        namaRole: roleTable.namaRole,
      })
      .from(roleTable)
      .orderBy(asc(roleTable.namaRole)),
  ])
  const hasRoles = roles.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-semibold tracking-normal">Member</h1>
        <p className="text-sm text-muted-foreground">
          Manage karyawan data and role assignments.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="overflow-hidden border">
          <div className="flex h-10 items-center justify-between border-b px-3">
            <h2 className="text-sm font-medium">Karyawan</h2>
            <span className="text-xs text-muted-foreground">
              {karyawan.length} total
            </span>
          </div>

          {karyawan.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">Contact</th>
                    <th className="px-3 py-2 font-medium">Role</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {karyawan.map((employee) => (
                    <tr key={employee.idKaryawan} className="border-b last:border-0">
                      <td className="px-3 py-2">
                        <Input
                          form={`update-karyawan-${employee.idKaryawan}`}
                          name="name"
                          defaultValue={employee.name}
                          aria-label={`Name for ${employee.name}`}
                          required
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          form={`update-karyawan-${employee.idKaryawan}`}
                          name="contact"
                          defaultValue={employee.contact}
                          aria-label={`Contact for ${employee.name}`}
                          required
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          form={`update-karyawan-${employee.idKaryawan}`}
                          name="idRole"
                          defaultValue={employee.idRole}
                          className="h-8 w-full min-w-32 border border-input bg-background px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                          aria-label={`Role for ${employee.name}`}
                          disabled={!hasRoles}
                          required
                        >
                          {roles.map((role) => (
                            <option key={role.idRole} value={role.idRole}>
                              {role.namaRole}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <label className="inline-flex h-8 items-center gap-2 text-xs">
                          <input
                            form={`update-karyawan-${employee.idKaryawan}`}
                            type="checkbox"
                            name="status"
                            defaultChecked={employee.status}
                            className="size-4 accent-primary"
                          />
                          Active
                        </label>
                      </td>
                      <td className="px-3 py-2">
                        <form
                          id={`update-karyawan-${employee.idKaryawan}`}
                          action={updateKaryawan}
                          className="flex flex-wrap gap-2"
                        >
                          <input
                            type="hidden"
                            name="idKaryawan"
                            value={employee.idKaryawan}
                          />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            disabled={!hasRoles}
                          >
                            Save
                          </Button>
                        </form>
                        {employee.status ? (
                          <form
                            action={deactivateKaryawan}
                            className="mt-2 flex"
                          >
                            <input
                              type="hidden"
                              name="idKaryawan"
                              value={employee.idKaryawan}
                            />
                            <Button
                              type="submit"
                              variant="destructive"
                              size="sm"
                            >
                              Deactivate
                            </Button>
                          </form>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-3 py-8 text-sm text-muted-foreground">
              No karyawan data found.
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-4">
          <section className="border">
            <div className="flex h-10 items-center border-b px-3">
              <h2 className="text-sm font-medium">Add Karyawan</h2>
            </div>

            <form action={createKaryawan} className="flex flex-col gap-3 p-3">
              <label className="flex flex-col gap-1.5 text-xs font-medium">
                Name
                <Input name="name" required />
              </label>
              <label className="flex flex-col gap-1.5 text-xs font-medium">
                Contact
                <Input name="contact" required />
              </label>
              <label className="flex flex-col gap-1.5 text-xs font-medium">
                Role
                <select
                  name="idRole"
                  className="h-8 w-full border border-input bg-background px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                  required
                  disabled={roles.length === 0}
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role.idRole} value={role.idRole}>
                      {role.namaRole}
                    </option>
                  ))}
                </select>
              </label>

              {!hasRoles ? (
                <p className="border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-700">
                  Add at least one role before creating karyawan.
                </p>
              ) : null}

              <Button type="submit" disabled={!hasRoles}>
                Add Karyawan
              </Button>
            </form>
          </section>

          <section className="border">
            <div className="flex h-10 items-center justify-between border-b px-3">
              <h2 className="text-sm font-medium">Roles</h2>
              <span className="text-xs text-muted-foreground">
                {roles.length} total
              </span>
            </div>

            <form action={createRole} className="flex flex-col gap-3 border-b p-3">
              <label className="flex flex-col gap-1.5 text-xs font-medium">
                Role Name
                <Input name="namaRole" required />
              </label>
              <Button type="submit" variant="outline">
                Add Role
              </Button>
            </form>

            {hasRoles ? (
              <div className="divide-y">
                {roles.map((role) => (
                  <div
                    key={role.idRole}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{role.namaRole}</span>
                    <span className="text-xs text-muted-foreground">
                      #{role.idRole}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-3 py-8 text-sm text-muted-foreground">
                No roles available. Karyawan records need a role before they can
                be created or updated.
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
