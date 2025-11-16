'use client'
import { fileUploadOnCloudinary } from '@/app/actions'
import { Checkbox } from '@/components/ui/checkbox'
import CustomDropZone from '@/components/ui/DropZone'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { Controller, useWatch } from 'react-hook-form'

export default function Declaration({ control, errors, setValue }) {
  const [signatureLoading, setSignatureLoading] = useState(false);
  const [signatureError, setSignatureError] = useState(false);
  const signatureUrl = useWatch({ control, name: 'declaration.signature' });

  const handleSignatureChange = async (file) => {
    setSignatureLoading(true);
    const response = await fileUploadOnCloudinary(file);
    if (response.success) {
      setValue('declaration.signature', response.data.fileUrl);
    } else {
      setSignatureError(true);
    }
    setSignatureLoading(false);
  }
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Controller
          control={control}
          name="declaration.declarations_accepted"
          id='declaration.declarations_accepted'
          render={({ field }) => (
            <Checkbox
              {...field}
              onCheckedChange={field.onChange}
              checked={field.value}
              error={errors.declaration?.declarations_accepted?.message}
              id='declaration.declarations_accepted'
            />
          )}
        />
        <Label errors={errors.declaration?.declarations_accepted?.message} htmlFor='declaration.declarations_accepted' className={' mb-0'}>I accept all declarations</Label>

      </div>
      <div className='max-w-56'>
        <Label>Signatory Name</Label>
        <Controller
          control={control}
          name="declaration.signatory_name"
          render={({ field }) => (
            <Input
              type="text"
              {...field}
              error={errors.declaration?.signatory_name?.message}
            />
          )}
        />
      </div>
      <div>

        <CustomDropZone
          imageContainerClassName='h-[140px] aspect-video' className='min-h-[120px] py-8'
          handleChange={handleSignatureChange}
          disabled={signatureLoading}
          error={signatureError}
          loading={signatureLoading}
          url={signatureUrl}
        >
          <div className=''>
            <p className='font-bold text-center'>Signature</p>
            <p className='text-center text-sm text-muted-foreground'>Drag and drop your signature here or click to upload</p>
          </div>
        </CustomDropZone>
      </div>
    </div>
  )
}