import {
  IconFolder,
  IconFolderOpen,
  IconPhotoPlus,
  IconPhotoSpark,
} from '@tabler/icons-react';
import DragDrop from '../DragDop';
import { Button } from './button';

const { cn } = require('@/lib/utils');
const { XCircle, Loader2, CheckCircle, Upload, X } = require('lucide-react');

const CustomDropZone = ({
  file,
  setFile,
  children,
  disabled = false,
  loading = false,
  url = null,
  error = false,
  className = '',
  imageContainerClassName = '',
  handleChange = () => {},
  ...props
}) => {
  const renderIcon = () => {
    if (loading === true) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }

    if (error === true) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }

    if (typeof url === 'string' && url.length > 0) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }

    return <IconPhotoPlus className="size-8 text-primary" />;
  };

  return (
    <DragDrop
      classes=""
      disabled={disabled}
      handleChange={handleChange}
      {...props}
    >
      <div
        className={cn(
          'border-2 min-h-[10px] px-4  py-4 w-full  border-dashed rounded-xl  items-center  gap-2 relative z-2 overflow-hidden ',
          disabled ? 'opacity-50' : '',
          {
            'flex-row justify-between flex': url,
            'bg-green-50/20 border-green-400': url && !error,
            'bg-red-50/20 border-red-500': error,
            'bg-yellow-100/20 border-yellow-500': loading,
          },
          className
        )}
      >
        {/* <div className="  flex items-center justify-center ">
          {renderIcon()}{' '}
        </div> */}

        {children ? (
          <div className="flex flex-col items-center gap-2">
            <div>{renderIcon()}</div>
            <div>{children}</div>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-semibold">
              Drop your file here or click to upload
            </p>
            <p className="text-xs  text-muted-foreground">Or click to browse</p>
          </div>
        )}
        <div />
        {url ? (
          <div
            className={cn(
              'h-[50px] aspect-4/3 border rounded-md overflow-hidden',
              imageContainerClassName
            )}
          >
            <img
              src={url}
              alt="document"
              className="w-full h-full object-contain"
            />
          </div>
        ) : file ? (
          <div className=" border rounded-md overflow-hidden bg-accent py-1 px-3 flex items-center gap-2">
            {file?.name}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setFile(null)}
              className={'!p-0 size-5 rounded'}
            >
              <X className="size-3" />
            </Button>
          </div>
        ) : null}
      </div>
    </DragDrop>
  );
};

export default CustomDropZone;
