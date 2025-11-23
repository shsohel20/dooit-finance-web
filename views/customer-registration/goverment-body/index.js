'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { GeneralInformationSection } from './General'
import { GovernmentBodySection } from './GovernmentBody'
import IdentificationDocuments from '../common/IdentificationDocuments'
import Declaration from '../common/Declaration'
import { zodResolver } from '@hookform/resolvers/zod'
import { kycFormSchema } from './schema'
import { useCustomerRegisterStore } from '@/app/store/useCustomerRegister'
import { customerOnboarding } from '@/app/customer/registration/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'


export default function GovernmentBodyRegistrationForm() {
  const [formLoading, setFormLoading] = useState(false)
  const router = useRouter()
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      requestedType: '',
      kyc: {
        general_information: {
          entity_name: '',
          country_of_formation: '',
          industry: '',
          contact_information: {
            email: '',
            phone: '',
          },
          registered_address: {
            street: '',
            suburb: '',
            state: '',
            postcode: '',
            country: '',
          },
        },
        government_body: {
          government_body_type: '',
          government_name: '',
          legislation_name: '',
        },
      },
      documents: [

      ],
      declaration: {
        declarations_accepted: false,
        signatory_name: '',
        signature: '',
        date: new Date().toISOString(),
      },
    },
  })
  const { country } = useCustomerRegisterStore()
  const onSubmit = async (data) => {
    setFormLoading(true)
    const submittedData = {
      token: localStorage.getItem('invite_token'),
      cid: localStorage.getItem('invite_cid'),
      requestedType: 'government_body',
      country: country?.value,
      kyc: data.kyc,
      documents: data.documents,
      declaration: data.declaration,
    }
    console.log('submittedData', JSON.stringify(submittedData, null, 2))
    try {
      const response = await customerOnboarding(submittedData)
      if (response.success) {
        toast.success('KYC form submitted successfully!')
        router.push('/customer/dashboard')
      } else {
        toast.error('Failed to submit KYC form!')
      }
    } catch (error) {
      toast.error('Failed to submit KYC form!')
    } finally {
      setFormLoading(false)
    }

  }
  console.log({ errors })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 mb-10">


      <div className='container my-10 space-y-6'>

        {/* General Information Section */}
        <GeneralInformationSection control={control} errors={errors} />

        {/* Government Body Section */}
        <GovernmentBodySection control={control} errors={errors} />

        {/* Documents Section */}
        <IdentificationDocuments control={control} errors={errors} />

        {/* Declaration Section */}
        <Declaration control={control} errors={errors} setValue={setValue} />
        {/* Submit Button */}
        <div className='flex justify-end'>
          <Button type="submit" className="" disabled={formLoading}>
            {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit '}

          </Button>
        </div>
      </div>


    </form>
  )
}
