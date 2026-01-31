import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '@/components/ui/FormField'
import { Loader2 } from 'lucide-react'
import { createUser, getUserById, updateUser } from '@/app/dashboard/client/user-and-role-management/actions'
import { toast } from 'sonner'


const initialState = {
    name: "",
    email: "",
    password: "",
    role: "",
    isActive: true,
  }

export default function UserForm({ open, setOpen, allRoles, fetchUsers,id, setId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordOptionalSchema = z.object({
    password: z.string().optional(),
  })
  const passwordRequiredSchema = z.object({
    password: z.string().min(1, "Password is required"),
  })
  const commonSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.string().min(1, "Role is required"),
    isActive: z.boolean(),
  })

  const updateSchema = commonSchema.merge(passwordOptionalSchema)
  const createSchema = commonSchema.merge(passwordRequiredSchema)

  const form = useForm({
    defaultValues: initialState,
    resolver: zodResolver(id ? updateSchema : createSchema)
  })
  useEffect(() => {
    if(id) {
      const fetchUser = async () => {
        const response = await getUserById(id)
        console.log('response', response)
        form.reset(response.data)
      }
      fetchUser()
    }
  }, [id])
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const action = id ? updateUser(id, data) : createUser(data)
      const response = await action
      console.log('response', response)
      if (response.success) {
        fetchUsers()
        toast.success(id ? 'User updated successfully!' : 'User created successfully!')
        setOpen(false)
      } else {
        toast.error('Failed to create user!')
      }
    } catch (error) {
      console.error('error', error)
      toast.error('Failed to create user!')
    } finally {
      setIsSubmitting(false)
    }
  }
  const roleOptions = allRoles.map(role => ({ label: role.name, value: role.name.toLowerCase() }))


  return (
    <Sheet open={open} onOpenChange={setOpen}>

      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>User</SheetTitle>
          <SheetDescription>Add a new user</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4.5">
          <FormField form={form} name="name" label="Name" type="text" placeholder="Name" />
          <FormField form={form} name="email" label="Email" type="email" placeholder="Email" />
          <FormField form={form} name="password" label="Password" type="password" placeholder="Password" />
          <FormField
            form={form}
            name="role" label="Role" type="select"
            placeholder="Select Role"
            options={roleOptions}
          />
          <FormField form={form} name="isActive" label="Is Active" type="checkbox" />
        <Button type="submit" className={'w-full'} onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
        </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
