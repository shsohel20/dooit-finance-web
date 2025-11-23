import { Controller, Control, FieldErrors } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'



export function GeneralInformationSection({ control, errors }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {/* Entity Name */}
          <div className="space-y-2">
            <Label htmlFor="entity_name">Entity Name</Label>
            <Controller
              name="kyc.general_information.entity_name"
              control={control}
              render={({ field }) => (
                <Input
                  id="entity_name"
                  placeholder="Enter entity name"
                  {...field}
                  error={errors?.kyc?.general_information?.entity_name?.message}
                />
              )}
            />
          </div>

          {/* Country of Formation */}
          <div className="space-y-2">
            <Label htmlFor="country_of_formation">Country of Formation</Label>
            <Controller
              name="kyc.general_information.country_of_formation"
              control={control}
              render={({ field }) => (
                <Input
                  id="country_of_formation"
                  placeholder="Enter country of formation"
                  {...field}
                  error={errors?.kyc?.general_information?.country_of_formation?.message}
                />
              )}
            />
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Controller
              name="kyc.general_information.industry"
              control={control}
              render={({ field }) => (
                <Input
                  id="industry"
                  placeholder="Enter industry"
                  {...field}
                  error={errors?.kyc?.general_information?.industry?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="kyc.general_information.contact_information.email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                    error={errors?.kyc?.general_information?.contact_information?.email?.message}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Controller
                name="kyc.general_information.contact_information.phone"
                control={control}
                render={({ field }) => (
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    {...field}
                    error={errors?.kyc?.general_information?.contact_information?.phone?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Registered Address */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-4">Registered Address</h4>
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Controller
                name="kyc.general_information.registered_address.street"
                control={control}
                render={({ field }) => (
                  <Input
                    id="street"
                    placeholder="Enter street address"
                    {...field}
                    error={errors?.kyc?.general_information?.registered_address?.street?.message}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="suburb">Suburb</Label>
                <Controller
                  name="kyc.general_information.registered_address.suburb"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="suburb"
                      placeholder="Enter suburb"
                      {...field}
                      error={errors?.kyc?.general_information?.registered_address?.suburb?.message}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Controller
                  name="kyc.general_information.registered_address.state"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="state"
                      placeholder="Enter state"
                      {...field}
                      error={errors?.kyc?.general_information?.registered_address?.state?.message}
                    />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode</Label>
                <Controller
                  name="kyc.general_information.registered_address.postcode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="postcode"
                      placeholder="Enter postcode"
                      {...field}
                      error={errors?.kyc?.general_information?.registered_address?.postcode?.message}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_country">Country</Label>
                <Controller
                  name="kyc.general_information.registered_address.country"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="address_country"
                      placeholder="Enter country"
                      {...field}
                      error={errors?.kyc?.general_information?.registered_address?.country?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
