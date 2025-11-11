import { CheckCircle, Loader2, Upload, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import FormTitle from './FormTitle';
import DragDrop from '@/components/DragDop';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import CustomSelect from '@/components/ui/CustomSelect';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { fileUploadOnCloudinary } from '@/app/actions';

const documentTypes = [
    { label: 'National ID', value: 'nid' },
    { label: 'Passport', value: 'passport' },
    { label: 'Driving License', value: 'driving_license' },
]

const DropZone = ({ children, disabled = false, loading = false, url = null, error = false }) => {
    const renderIcon = () => {
        if (loading === true) {
            return <Loader2 className='w-4 h-4 animate-spin' />
        }

        if (error === true) {
            return <XCircle className='w-4 h-4 text-red-500' />
        }

        if (typeof url === 'string' && url.length > 0) {
            return <CheckCircle className='w-4 h-4 text-green-500' />
        }

        return <Upload className='w-4 h-4' />
    }


    return (
        <div className={cn('border-2 min-h-[400px] w-full border-dashed rounded-xl flex flex-col items-center justify-center gap-2 relative z-2 overflow-hidden', disabled ? 'opacity-50' : '', {
            'bg-green-50/20 border-green-400': url && !error,
            'bg-red-50/20 border-red-500': error,
            'bg-yellow-100/20 border-yellow-500': loading,
        })}>
            <div className='bg-secondary size-10 rounded-full flex items-center justify-center'>{renderIcon()} </div>

            {children}
            <div />
            {url && <div className='h-[250px] aspect-3/4 border rounded-md overflow-hidden'>
                <img src={url} alt="document" className='w-full h-full object-cover' />
            </div>}
        </div>
    )
}
const IdentificationDocuments = ({ control, errors }) => {

    //front
    const [frontLoading, setFrontLoading] = useState(false);
    const [frontUrl, setFrontUrl] = useState(null);
    const [frontError, setFrontError] = useState(false);
    //back
    const [backLoading, setBackLoading] = useState(false);
    const [backUrl, setBackUrl] = useState(null);
    const [backError, setBackError] = useState(false);
    const { fields, append, remove, } = useFieldArray({
        control,
        name: "documents",
    });
    const documentTypeValue = useWatch({
        control,
        name: "document_type",
    });
    console.log('fields', fields);

    const handleFrontChange = async (file) => {
        console.log('file', file);
        setFrontLoading(true);
        const response = await fileUploadOnCloudinary(file);
        if (response.success) {
            setFrontUrl(response.data.fileUrl);
            append({
                name: file.name,
                url: response.data.fileUrl,
                mimeType: file.type,
                type: 'front',
                docType: documentTypeValue?.value,
            })
        } else {
            setFrontError(true);
        }
        setFrontLoading(false);
        console.log('response', response);
    }
    const handleBackChange = async (file) => {
        console.log('file', file);
        setBackLoading(true);
        const response = await fileUploadOnCloudinary(file);
        if (response.success) {
            setBackUrl(response.data.fileUrl);
            append({
                name: file.name,
                url: response.data.fileUrl,
                mimeType: file.type,
                type: 'back',
                docType: documentTypeValue?.value,
            })
        }
        else {
            setBackError(true);
        }
        setBackLoading(false);
        console.log('response', response);
    }
    const handleDocumentTypeChange = (e, onChange) => {
        onChange(e);
        setFrontUrl(null);
        setBackUrl(null);
        setFrontError(false);
        setBackError(false);
        fields.forEach(field => {
            remove(field.id);
        });
    }
    console.log('control', control)
    return (
        <div className='mt-4'>
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
                            onChange={(e) => handleDocumentTypeChange(e, field.onChange)}
                        />
                    )}
                />
                {/* <CustomSelect
                    label='Select Document Type'
                    options={documentTypes}
                    value={documentType}
                    placeholder='Select Document Type'
                    onChange={handleDocumentTypeChange}
                /> */}
            </div>
            <div className='flex gap-4'>
                <div className='w-full'>
                    <DragDrop
                        classes=''
                        disabled={!documentTypeValue}
                        handleChange={handleFrontChange}
                    >
                        {/* <p className='mb-2'>Upload Bank statement <span className='italic'>(issued within 30 days and covers 90
                            days of transaction history)</span></p> */}
                        <DropZone
                            disabled={!documentTypeValue}
                            loading={frontLoading}
                            url={fields.find(field => field.type === 'front')?.url}
                            error={frontError}
                        >
                            <p>Front of document</p>
                        </DropZone>
                    </DragDrop>
                </div>
                <div className='w-full'>
                    <DragDrop
                        classes=''
                        handleChange={handleBackChange}
                        disabled={!documentTypeValue}
                    >
                        <DropZone
                            disabled={!documentTypeValue}
                            loading={backLoading}
                            url={fields.find(field => field.type === 'back')?.url}
                            error={backError}>
                            <p>Back of document</p>
                        </DropZone>
                    </DragDrop>
                </div>
            </div>

        </div>
    );
};

export default IdentificationDocuments;