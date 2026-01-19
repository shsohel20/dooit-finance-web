import { FormField } from '@/components/ui/FormField'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { getAllRules, getRuleById, updateRule } from '@/app/dashboard/client/risk-rule-engine/rule-configuration/actions'

export default function RuleConfigurationForm({ open, setOpen, currentItem, setCurrentItem, setData, data: ruleConfigurations }) {
  console.log('currentItem', currentItem)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm({
    defaultValues: {
      ruleName: '',
      descriptiveExplanation: '',
      ruleDomainSubdomain: '',
      mainDomain: '',
      id: currentItem?.id,
      ruleCondition: '',
    },
    resolver: zodResolver(z.object({
      ruleName: z.string().optional(),
      descriptiveExplanation: z.string().optional(),
      ruleDomainSubdomain: z.string().optional(),
      mainDomain: z.string().optional(),
      ruleCondition: z.string().optional(),
    })),
  })

  const getRule = async () => {
    try {
      const res = await getRuleById(currentItem._id)
      console.log('res', res)
       form.reset(res?.data)
    } catch (error) {

    }
  }
  useEffect(() => {
    if (currentItem) {
      getRule()
    }
  }, [currentItem])
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    const res = await updateRule(currentItem._id, data)
    if (res.success) {
      setIsSubmitting(false)
     const allRules=await getAllRules()
      setData(allRules?.data ||[])
      setCurrentItem(null)
      setOpen(false)
      toast.success('Rule configuration updated successfully')
    } else {
      setIsSubmitting(false)
      toast.error(res.message)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setCurrentItem(null)
    form.reset()
  }
  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className={'sm:max-w-2xl'}>
        <SheetHeader>
          <SheetTitle>Rule Configuration</SheetTitle>
          <div>

          </div>
        </SheetHeader>
        {/* form */}
        <div className='px-6 space-y-4'>
          <FormField form={form} name='ruleName' label='Name' type='text' />
          <FormField form={form} name='ruleCondition' label='Condition' type='text' />
          <FormField form={form} name='descriptiveExplanation' label='Description' type='textarea' />
          <FormField form={form} name='mainDomain' label='Main Domain' type='text'  />
          <FormField form={form} name='ruleDomainSubdomain' label='Sub Domain' type='text'  />
          <FormField form={form} name='riskScore' label='Risk Score' type='number'  />
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
