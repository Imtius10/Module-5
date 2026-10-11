"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Ban, RotateCcw, Search, ShieldCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Pager } from "@/components/ui/pager";
import { PageHeader } from "@/components/dashboard/page-header";
import { api, errorMessage } from "@/lib/api";
import { fetchAdminUsers, queryKeys } from "@/lib/queries";
import { formatDate, initials } from "@/lib/format";
import type { Role, User, UserStatus } from "@/lib/types";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | Role>("ALL");
  const queryClient = useQueryClient();
  const queryKey = queryKeys.adminUsers(page);

  const query = useQuery({
    queryKey,
    queryFn: () => fetchAdminUsers(page),
  });

  const update = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: { status?: UserStatus; role?: Role };
    }) => {
      if (patch.status) {
        await api.patch(`/api/admin/users/${id}/status`, {
          status: patch.status,
        });
      }
      if (patch.role) {
        await api.patch(`/api/admin/users/${id}/role`, { role: patch.role });
      }
      return { id, patch };
    },

    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey });
      const snapshot = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (current?: {
        items: User[];
        meta: unknown;
      }) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.map((user) =>
            user.id === id
              ? {
                  ...user,
                  ...(patch.status ? { activeStatus: patch.status } : {}),
                  ...(patch.role ? { role: patch.role } : {}),
                }
              : user
          ),
        };
      });
      return { snapshot };
    },

    onSuccess: ({ patch }) => {
      if (patch.status) {
        toast.success(
          patch.status === "ACTIVE"
            ? "User reactivated"
            : "User blocked from signing in"
        );
      }
      if (patch.role) {
        toast.success(`Role changed to ${patch.role}`);
      }
    },

    onError: (error, _vars, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot);
        void queryClient.invalidateQueries({ queryKey });
      }
      toast.error(errorMessage(error));
    },

    onSettled: () => void queryClient.invalidateQueries({ queryKey }),
  });

  const items = query.data?.items ?? [];

  // The API only pages through users, so search/role filtering happens here.
  const filtered = items.filter((user) => {
    const needle = search.trim().toLowerCase();
    const matchesSearch =
      !needle ||
      user.name.toLowerCase().includes(needle) ||
      user.email.toLowerCase().includes(needle);
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="User management"
        description="Suspend accounts, restore access or switch a user's role."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email…"
            className="pl-9"
            aria-label="Search users"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "TENANT", "LANDLORD", "ADMIN"] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                roleFilter === role
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {role === "ALL" ? "All roles" : role}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {query.isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="p-5">
              <EmptyState
                title="Users couldn't be loaded"
                description={errorMessage(query.error)}
                action={<Button onClick={() => query.refetch()}>Retry</Button>}
              />
            </div>
          ) : items.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={ShieldCheck} title="No users found" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={Search}
                title="No users match your filters"
                description="Try a different search term or role."
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      setRoleFilter("ALL");
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => {
                    const blocked = user.activeStatus === "BLOCKED";
                    const isAdmin = user.role === "ADMIN";
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                              {initials(user.name)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {user.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={user.role}
                            disabled={isAdmin || update.isPending}
                            onValueChange={(role) =>
                              update.mutate({
                                id: user.id,
                                patch: { role: role as Role },
                              })
                            }
                          >
                            <SelectTrigger
                              className="h-8 w-32 text-xs"
                              aria-label="Change role"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TENANT">Tenant</SelectItem>
                              <SelectItem value="LANDLORD">Landlord</SelectItem>
                              <SelectItem value="ADMIN" disabled>
                                Admin
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={blocked ? "destructive" : "outline"}
                            className="gap-1"
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                blocked ? "bg-white" : "bg-emerald-500"
                              }`}
                            />
                            {blocked ? "Blocked" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={blocked ? "default" : "destructive"}
                            disabled={isAdmin || update.isPending}
                            onClick={() =>
                              update.mutate({
                                id: user.id,
                                patch: {
                                  status: blocked ? "ACTIVE" : "BLOCKED",
                                },
                              })
                            }
                          >
                            {update.isPending ? (
                              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : blocked ? (
                              <RotateCcw className="size-4" />
                            ) : (
                              <Ban className="size-4" />
                            )}
                            {blocked ? "Unblock" : "Block"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pager meta={query.data?.meta} onPageChange={setPage} />
    </div>
  );
}
