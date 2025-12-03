import DragDrop from "../DragDop";

const { cn } = require("@/lib/utils");
const { XCircle, Loader2, CheckCircle, Upload } = require("lucide-react");

const CustomDropZone = ({
  children,
  disabled = false,
  loading = false,
  url = null,
  error = false,
  className = "",
  imageContainerClassName = "",
  handleChange = () => {},
}) => {
  const renderIcon = () => {
    if (loading === true) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }

    if (error === true) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }

    if (typeof url === "string" && url.length > 0) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }

    return <Upload className="w-4 h-4" />;
  };

  return (
    <DragDrop classes="" disabled={disabled} handleChange={handleChange}>
      <div
        className={cn(
          "border-2 min-h-[200px] py-6 w-full border-dashed rounded-xl flex flex-col items-center justify-center gap-2 relative z-2 overflow-hidden bg-primary/5",
          disabled ? "opacity-50" : "",
          {
            "bg-green-50/20 border-green-400": url && !error,
            "bg-red-50/20 border-red-500": error,
            "bg-yellow-100/20 border-yellow-500": loading,
          },
          className
        )}
      >
        <div className="bg-secondary size-10 rounded-full flex items-center justify-center">
          {renderIcon()}{" "}
        </div>

        {children}
        <div />
        {url && (
          <div
            className={cn(
              "h-[250px] aspect-3/4 border rounded-md overflow-hidden",
              imageContainerClassName
            )}
          >
            <img
              src={url}
              alt="document"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </DragDrop>
  );
};

export default CustomDropZone;
