"use client"
import CustomSelect from '@/components/ui/CustomSelect'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { countriesData } from '@/constants'
import React, { Fragment } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'

export default function Directors({ control, errors }) {
  const {
    fields: directorFields,
    append: appendDirector,
    remove: removeDirector,
  } = useFieldArray({
    control,
    name: "directors_beneficial_owner.directors",
  })
  const {
    fields: beneficialOwnerFields,
    append: appendBeneficialOwner,
    remove: removeBeneficialOwner,
  } = useFieldArray({
    control,
    name: "directors_beneficial_owner.beneficial_owners",
  })
  return (
    <div className='space-y-8'>
      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-foreground">Directors</h3>
        </div>
        {/* directors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {directorFields.map((field, index) => (
            <Fragment key={field.id}>
              <div key={field.id}>
                <Label>Director</Label>
                <Controller
                  control={control}
                  name={`directors_beneficial_owner.directors.${index}.given_name`}
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      error={errors.directors_beneficial_owner?.directors?.[index]?.given_name?.message}
                    />
                  )}
                />


              </div>
              <div>
                <Label>Surname</Label>
                <Controller
                  control={control}
                  name={`directors_beneficial_owner.directors.${index}.surname`}
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      error={errors.directors_beneficial_owner?.directors?.[index]?.surname?.message}
                    />
                  )}
                />
              </div>
            </Fragment>
          ))}
        </div>

      </div>
      <div className="border rounded-lg p-4">
        {/* beneficial owners */}
        <div className="">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Beneficial Owners</h3>
          </div>
          <div >
            {beneficialOwnerFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label>Beneficial Owner</Label>
                  <Controller
                    control={control}
                    name={`directors_beneficial_owner.beneficial_owners.${index}.full_name`}
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        error={errors.directors_beneficial_owner?.beneficial_owners?.[index]?.full_name?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Controller
                    control={control}
                    name={`directors_beneficial_owner.beneficial_owners.${index}.date_of_birth`}
                    render={({ field }) => (
                      <Input
                        type="date"
                        {...field}
                        error={errors.directors_beneficial_owner?.beneficial_owners?.[index]?.date_of_birth?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>Street</Label>
                  <Controller
                    control={control}
                    name={`directors_beneficial_owner.beneficial_owners.${index}.residential_address.street`}
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        error={errors.directors_beneficial_owner?.beneficial_owners?.[index]?.residential_address?.street?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>Suburb</Label>
                  <Controller
                    control={control}
                    name={`directors_beneficial_owner.beneficial_owners.${index}.residential_address.suburb`}
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        error={errors.directors_beneficial_owner?.beneficial_owners?.[index]?.residential_address?.suburb?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Controller
                    control={control}
                    name={`directors_beneficial_owner.beneficial_owners.${index}.residential_address.state`}
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        error={errors.directors_beneficial_owner?.beneficial_owners?.[index]?.residential_address?.state?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>Postcode</Label>
                  <Controller
                    control={control}
                    name={`directors_beneficial_owner.beneficial_owners.${index}.residential_address.postcode`}
                    render={({ field }) => (
                      <Input
                        type="text"
                        {...field}
                        error={errors.directors_beneficial_owner?.beneficial_owners?.[index]?.residential_address?.postcode?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Controller
                    control={control}
                    name={`directors_beneficial_owner.beneficial_owners.${index}.residential_address.country`}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        options={countriesData}
                        onChange={(data) => field.onChange(data)}
                        error={errors.directors_beneficial_owner?.beneficial_owners?.[index]?.residential_address?.country?.message}
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
