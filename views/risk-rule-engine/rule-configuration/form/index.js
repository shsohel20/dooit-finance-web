import { FormField } from '@/components/ui/FormField'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

export default function RuleConfigurationForm({ open, setOpen, currentItem, setCurrentItem, setData, data: ruleConfigurations }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      ruleDomain: '',
      mainDomain: '',
      id: currentItem?.id,
    },
    resolver: zodResolver(z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      ruleDomain: z.string().optional(),
      mainDomain: z.string().optional(),
    })),
  })
  useEffect(() => {
    if (currentItem) {
      form.reset(currentItem)
    }
  }, [currentItem])
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    //sleep for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    const updatedData = ruleConfigurations.map(item => item.id === currentItem.id ? { ...item, ...data } : item)
    setData(updatedData)
    setCurrentItem(null)
    setOpen(false)
    toast.success('Rule configuration updated successfully')
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className={'sm:max-w-2xl'}>
        <SheetHeader>
          <SheetTitle>Rule Configuration</SheetTitle>
          <div>

          </div>
        </SheetHeader>
        {/* form */}
        <div className='px-6 space-y-4'>
          <FormField form={form} name='name' label='Name' type='text' />
          <FormField form={form} name='description' label='Description' type='textarea' />
          <FormField form={form} name='ruleDomain' label='Rule Domain' type='text' options={[]} />
          <FormField form={form} name='mainDomain' label='Main Domain' type='text' options={[]} />
          <div>
            <Button onClick={form.handleSubmit(onSubmit)} className={'w-full'} type='submit' disabled={isSubmitting}>
              <Save className='w-4 h-4 text-accent' /> {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </ Sheet>
  )
}
