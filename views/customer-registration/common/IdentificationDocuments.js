import React, { useState } from 'react';
import FormTitle from './FormTitle';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { fileUploadOnCloudinary } from '@/app/actions';
import CustomDropZone from '@/components/ui/DropZone';
import { Button } from '@/components/ui/button';
import { getDataFromDocuments } from '@/app/customer/registration/actions';
import { toast } from 'sonner';


const documentTypes = [
    { label: 'Passport', value: 'Passport' },
    { label: 'Driving License', value: 'Driving License' },
    { label: 'Medical Card', value: 'Medical Card' },
]

function formatDate(dateString) {
    console.log('dateString', dateString);
    if (!dateString) return "";
  
    const [day, mon, year] = dateString.split(" ");
  
    const months = {
      JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
      JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12"
    };
  
    const month = months[mon];
    if (!month) return ""; // invalid month
  
    const formattedDate = `${year}-${month}-${day.padStart(2, "0")}`;
    console.log('formattedDate', formattedDate);
    return formattedDate;
  }
  
const IdentificationDocuments = ({ control, errors, setValue }) => {
const [isSaving, setIsSaving] = useState(false);
    //front
    const [frontLoading, setFrontLoading] = useState(false);
    const [frontError, setFrontError] = useState(false);
    const [frontFile, setFrontFile] = useState(null);
    //back
    const [backLoading, setBackLoading] = useState(false);
    const [backError, setBackError] = useState(false);
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "documents",
    });
    const documentTypeValue = useWatch({
        control,
        name: "document_type",
    });
    console.log('front image error', frontError);

    const handleFrontChange = async (file) => {
        setFrontFile(file);
        setFrontLoading(true);
        const response = await fileUploadOnCloudinary(file);
        if (response.success) {
            const existingFrontIndex = fields.findIndex((item) => item.type === 'front');
            if (existingFrontIndex !== -1) {
                update(existingFrontIndex, {
                    ...fields[existingFrontIndex],
                    name: file.name,
                    url: response.data.fileUrl,
                    mimeType: file.type,
                });
            } else {
                append({
                    name: file.name,
                    url: response.data.fileUrl,
                    mimeType: file.type,
                    type: 'front',
                    docType: documentTypeValue?.value,
                });
            }
        } else {
            setFrontError(true);
        }
        setFrontLoading(false);
    }

    const handleBackChange = async (file) => {
        setBackLoading(true);
        const response = await fileUploadOnCloudinary(file);
        if (response.success) {
            const existingBackIndex = fields.findIndex((item) => item.type === 'back');
            if (existingBackIndex !== -1) {
                update(existingBackIndex, {
                    ...fields[existingBackIndex],
                    name: file.name,
                    url: response.data.fileUrl,
                    mimeType: file.type,
                });
            } else {
                append({
                    name: file.name,
                    url: response.data.fileUrl,
                    mimeType: file.type,
                    type: 'back',
                    docType: documentTypeValue?.value,
                })
            }
        }
        else {
            setBackError(true);
        }
        setBackLoading(false);
    }
    const handleDocumentTypeChange = (e, onChange) => {
        onChange(e);
        setFrontError(false);
        setBackError(false);
        fields.forEach(field => {
            remove(field.id);
        });
    }
    const handleSave = async () => {
        const formData = new FormData();
        formData.append('image', frontFile);
        formData.append('card_type', documentTypeValue?.value);
       try {
        setIsSaving(true);
        const response = await getDataFromDocuments(formData);
        console.log('response', response);
        if(response.success){
            const [given_name, middle_name, surname] = response.data.full_name?.split(' ');
            //23-dec-1990 to yyyy-mm-dd
            const date_of_birth = formatDate(response.data.date_of_birth);
            console.log('date_of_birth', date_of_birth);
            setValue('customer_details.given_name', given_name || '');
            setValue('customer_details.middle_name', middle_name || '');
            setValue('customer_details.surname', surname || '');
            setValue('residential_address.address', response.data.address || '');
            setValue('customer_details.date_of_birth', date_of_birth || '');

        }
       
       } catch (error) {
        toast.error('Failed to save identification documents');
       } finally {
        setIsSaving(false);
       }
       
    }
    return (
        <div className='mt-4 '>

            <div>
                <FormTitle>Identification Documents</FormTitle>
                <div className='max-w-56 my-4 relative z-3'>
                    <Controller
                        control={control}
                        name='document_type'
                        render={({ field }) => (
                            <CustomSelect
                                label='Select Document Type'
                                options={documentTypes}
                                value={field.value}
                                placeholder='Select Document Type'
                                error={errors.document_type?.message}
                                onChange={(e) => handleDocumentTypeChange(e, field.onChange)}
                            />
                        )}
                    />
                </div>
                <div className='flex gap-4'>
                    <div className='w-full'>

                        <CustomDropZone
                            handleChange={handleFrontChange}
                            disabled={!documentTypeValue}
                            loading={frontLoading}
                            url={fields.find(field => field.type === 'front')?.url}
                            error={frontError}
                        >
                            <p className='font-bold'>Front of document</p>
                            <p className='text-sm text-muted-foreground'>Drag and drop your document here or click to upload</p>
                        </CustomDropZone>

                    </div>
                    <div className='w-full'>

                        <CustomDropZone
                            disabled={!documentTypeValue}
                            handleChange={handleBackChange}
                            loading={backLoading}
                            url={fields.find(field => field.type === 'back')?.url}
                            error={backError}>
                            <p className='font-bold'>Back of document</p>
                            <p className='text-sm text-muted-foreground'>Drag and drop your document here or click to upload</p>
                        </CustomDropZone>
                    </div>
                </div>
            </div>
<div className='py-6 flex justify-end'>
    <Button onClick={handleSave}>{isSaving ? 'Please wait...' : 'Auto Fill'}</Button>
</div>
        </div>
    );
};

export default IdentificationDocuments;