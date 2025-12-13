import React, { useState } from 'react';
import FormTitle from './FormTitle';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { fileUploadOnCloudinary } from '@/app/actions';
import CustomDropZone from '@/components/ui/DropZone';
import { Button } from '@/components/ui/button';
import { getDataFromDocuments, verifyDocument } from '@/app/customer/registration/actions';
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

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
const IdentificationDocuments = ({ control, errors, setValue, setVerifyingStatus }) => {
    const [isSaving, setIsSaving] = useState(false);
    //front
    const [frontLoading, setFrontLoading] = useState(false);
    const [frontError, setFrontError] = useState(false);
    const [frontFile, setFrontFile] = useState(null);
    const [frontBase64, setFrontBase64] = useState(null);
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
   

    const handleFrontChange = async (file) => {
        setFrontFile(file);
        const base64 = await getBase64(file);
        setFrontBase64(base64.replace('data:image/jpeg;base64,', ''));
        setFrontLoading(true);
        try {
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
        } catch (error) {
            console.error('Front change error', error);
            setFrontError(true);
        } finally {
            setFrontLoading(false);
        }

    }

    const handleBackChange = async (file) => {
        setBackLoading(true);
        try {
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
        } catch (error) {
            console.error('Back change error', error);
            setBackError(true);
        } finally {
            setBackLoading(false);
        }
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
        const live_photo = localStorage.getItem('live_photo').replace('data:image/jpeg;base64,', '');
        const verify_data={
            app_id: 1,
            image_1: frontBase64,
            image_2: live_photo,
            hash: ''
        }
        try {
            setIsSaving(true);
            setVerifyingStatus('verifying');
            const verify_response= await verifyDocument(verify_data);
            
            if(verify_response?.error?.length > 0){
                toast.error("Documents are not verified");
                setVerifyingStatus('idle');
                return;
            }else{
                const response = await getDataFromDocuments(formData);
                console.log('response', response);
                if (response.success) {
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
            }
        } catch (error) {
            toast.error('Failed to save identification documents');
        } finally {
            setIsSaving(false);
            setVerifyingStatus('verified');
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
                <Button
                    disabled={isSaving}
                    onClick={handleSave}>
                    {isSaving ? 'Please wait...' : 'Upload'}
                </Button>
            </div>
        </div>
    );
};

export default IdentificationDocuments;