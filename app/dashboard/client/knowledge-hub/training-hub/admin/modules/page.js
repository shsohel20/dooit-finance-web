"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateModuleDialog } from "@/components/create-module-dialog";
import { useModules } from "@/contexts/module-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Search,
  Grid3x3,
  List,
  Trash2,
  Edit2,
  BookOpen,
  FileText,
  HelpCircle,
  Clock,
  Eye,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { getModules } from "../../actions";
import { Skeleton } from "@/components/ui/skeleton";

export default function ModulesPage() {
  const router = useRouter();
  const user = { role: "admin" };
  // const { modules, deleteModule } = useModules();
  const [modules, setModules] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [view, setView] = useState("card");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openModuleForm, setOpenModuleForm] = useState(false);

  const canEdit = user?.role === "admin";

  const filtered = modules.filter((module) => {
    const matchesSearch = module.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || module.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const fetchModules = useCallback(async () => {
    setFetching(true);
    const res = await getModules();
    setModules(res.data);
    setFetching(false);
  }, []);

  useEffect(() => {
    fetchModules();
  }, []);
  const publishedCount = modules.filter((m) => m.status === "published").length;
  const draftCount = modules.filter((m) => m.status === "draft").length;
  const totalParts = modules.reduce((a, m) => a + m.parts.length, 0);
  const totalQuestions = modules.reduce(
    (a, m) => a + m.parts.reduce((b, p) => b + p.questions.length, 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tighter">
            Training Modules
          </h1>
        </div>
        {canEdit && openModuleForm && (
          <CreateModuleDialog
            open={openModuleForm}
            setOpen={setOpenModuleForm}
            getAll={fetchModules}
            // moduleData={}
          />
        )}
        <Button className="gap-2" onClick={() => setOpenModuleForm(true)}>
          <Plus className="w-4 h-4" />
          Create Module
        </Button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: modules.length,
            icon: BookOpen,
            color: "text-primary bg-primary/10",
          },
          {
            label: "Published",
            value: publishedCount,
            icon: Eye,
            color: "text-[hsl(142_71%_45%)] bg-[hsl(142_71%_45%)]/10",
          },
          {
            label: "Parts",
            value: totalParts,
            icon: FileText,
            color: "text-accent bg-accent/10",
          },
          {
            label: "Questions",
            value: totalQuestions,
            icon: HelpCircle,
            color: "text-[hsl(38_92%_50%)] bg-[hsl(38_92%_50%)]/10",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 bg-muted/30">
            <CardContent className="flex items-center gap-3 py-4">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border border-border rounded-lg p-0.5 bg-muted/30 flex-shrink-0">
            <Button
              variant={view === "table" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-3"
              onClick={() => setView("table")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "card" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-3"
              onClick={() => setView("card")}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Showing count */}
      <p className="text-sm text-muted-foreground -mt-4">
        Showing {filtered.length} of {modules.length} modules
      </p>
      {fetching ? (
        <div>
          <div>
            <Skeleton className="h-4 w-[200px] mb-4" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filtered.length === 0 && (
            <Card className="border-dashed border-2 border-border">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {modules.length === 0 ? "No modules yet" : "No modules match your filters"}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {modules.length === 0
                    ? "Create your first training module to get started."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {canEdit && modules.length === 0 && <CreateModuleDialog />}
              </CardContent>
            </Card>
          )}

          {/* Table View */}
          {view === "table" && filtered.length > 0 && (
            <Card className="border-border/60 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Module</TableHead>
                      <TableHead className="font-semibold">Parts</TableHead>
                      <TableHead className="font-semibold">Questions</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Created</TableHead>
                      {canEdit && (
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((module) => {
                      const qCount = module.parts.reduce((a, p) => a + p.questions.length, 0);
                      return (
                        <TableRow
                          key={module.id}
                          className="cursor-pointer hover:bg-muted/40 transition-colors"
                          onClick={() => {
                            if (canEdit)
                              router.push(
                                `/dashboard/client/knowledge-hub/training-hub/admin/modules/${module.id}/edit`,
                              );
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${module.status === "published" ? "bg-[hsl(142_71%_45%)]/10 text-[hsl(142_71%_45%)]" : "bg-[hsl(38_92%_50%)]/10 text-[hsl(38_92%_50%)]"}`}
                              >
                                <BookOpen className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{module.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-foreground">
                              {module.parts.length}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-foreground">{qCount}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                module.status === "published"
                                  ? "bg-[hsl(142_71%_45%)]/10 text-[hsl(142_71%_45%)] border-0"
                                  : "bg-[hsl(38_92%_50%)]/10 text-[hsl(38_92%_50%)] border-0"
                              }
                            >
                              {module.status === "published" ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(module.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          {canEdit && (
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setOpenModuleForm(true)}>
                                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    // onClick={() => deleteModule(module.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}

          {/* Card View */}
          {view === "card" && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((module) => {
                const qCount = module.parts.reduce((a, p) => a + p.questions.length, 0);
                return <CardView key={module?._id} module={module} canEdit={canEdit} />;
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const CardView = ({ module, canEdit }) => {
  const router = useRouter();
  const [openModuleForm, setOpenModuleForm] = useState(false);
  const qCount = module.parts.reduce((a, p) => a + p.questions.length, 0);
  return (
    <Card
      key={module.id}
      className="border-border/60 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300  group"
    >
      {/* {
        openModuleForm && (
          <CreateModuleDialog
            open={openModuleForm}
            setOpen={setOpenModuleForm}
            getAll={() => {}}
            moduleData={module}
          />
        )
      } */}
      {/* Color bar */}
      <div
        className={`h-1.5 ${module.status === "published" ? "bg-gradient-to-r from-[hsl(142_71%_45%)] to-accent" : "bg-gradient-to-r from-[hsl(38_92%_50%)] to-[hsl(38_92%_50%)]/50"}`}
      />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={
                  module.status === "published"
                    ? "bg-[hsl(142_71%_45%)]/10 text-[hsl(142_71%_45%)] border-0 text-xs"
                    : "bg-[hsl(38_92%_50%)]/10 text-[hsl(38_92%_50%)] border-0 text-xs"
                }
              >
                {module.status === "published" ? "Published" : "Draft"}
              </Badge>
            </div>
            <CardTitle
              onClick={() => {
                if (canEdit)
                  router.push(
                    `/dashboard/client/knowledge-hub/training-hub/admin/modules/${module.id}/edit`,
                  );
              }}
              className="text-base group-hover:text-primary transition-colors group-hover:underline cursor-pointer"
            >
              {module.title}
            </CardTitle>
          </div>
          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setOpenModuleForm(true)}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  // onClick={() => deleteModule(module.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-2 text-sm">{module.description}</CardDescription>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-muted/40">
            <p className="text-lg font-bold text-foreground">{module.parts.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Parts</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/40">
            <p className="text-lg font-bold text-foreground">{qCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Questions</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/40">
            <p className="text-lg font-bold text-foreground">
              {module.parts.length > 0 ? Math.round(qCount / module.parts.length) : 0}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg/Part</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {new Date(module.createdAt).toLocaleDateString()}
          </div>
          {canEdit && (
            <span
              className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
              onClick={() => setOpenModuleForm(true)}
            >
              Edit <Edit2 className="w-3 h-3" />
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
