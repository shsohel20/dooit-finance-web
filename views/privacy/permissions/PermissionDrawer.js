import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { getAllPermissions } from "@/app/dashboard/client/user-and-role-management/actions";

const PermissionDrawer = ({ open, onClose, role }) => {
  const [allPermissions, setAllPermissions] = useState([]);
  useEffect(() => {
    const fetchPermissions = async () => {
      const permissions = await getAllPermissions();
      setAllPermissions(permissions);
    };
    fetchPermissions();
  }, []);
  console.log("allPermissions", allPermissions);
  return (
    <Sheet open={open} onOpenChange={onClose}>
      {/* <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="w-full mt-4">
          <EyeIcon /> View Permissions
        </Button>
      </SheetTrigger> */}
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Permissions</SheetTitle>
          <SheetDescription>{role.name} permissions</SheetDescription>
        </SheetHeader>
        <div className=" px-4  py-4 mx-4 rounded-lg border">
          <h2 className="text-sm text-gray-600 mb-8">
            Total Permissions <span className="text-gray-900">({role.permissions.length})</span>
          </h2>
          <div className="space-y-6">
            {role.permissions.map((permission) => (
              <div key={permission.name} className="flex items-center gap-2">
                <Checkbox id={permission.name} />
                <div className="relative " htmlFor={permission.name}>
                  <p className="text-gray-800 font-semibold">{permission}</p>
                  {/* <p className="text-sm text-gray-500">{permission.description}</p> */}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button size="sm" className="">
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PermissionDrawer;
