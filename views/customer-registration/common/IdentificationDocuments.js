import React, { useState } from 'react';
import FormTitle from './FormTitle';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { fileUploadOnCloudinary } from '@/app/actions';
import CustomDropZone from '@/components/ui/DropZone';


const documentTypes = [
    { label: 'National ID', value: 'nid' },
    { label: 'Passport', value: 'passport' },
    { label: 'Driving License', value: 'driving_license' },
]


const IdentificationDocuments = ({ control, errors }) => {

    //front
    const [frontLoading, setFrontLoading] = useState(false);
    const [frontError, setFrontError] = useState(false);
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

        </div>
    );
};

export default IdentificationDocuments;