"use client"
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getPolicyById } from "../actions";
import dynamic from "next/dynamic";
const EditorForm = dynamic(() => import("@/views/knowledge-hub/policy-hub/policy-form/Editor"), { ssr: false });
import { toast } from "sonner";
import { parseToEditorJS } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const DocSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-4/5 h-10" />
      <Skeleton className="w-3/5 h-10" />
      <Skeleton className="w-2/5 h-10" />
      <Skeleton className="w-1/5 h-10" />
      <Skeleton className="w-4/5 h-10" />
      <Skeleton className="w-3/5 h-10" />
      <Skeleton className="w-2/5 h-10" />
      <Skeleton className="w-1/5 h-10" />
      <Skeleton className="w-4/5 h-10" />
      <Skeleton className="w-3/5 h-10" />
      <Skeleton className="w-2/5 h-10" />
      <Skeleton className="w-1/5 h-10" />
    </div>
  )
}
export default function PolicyDetails() {
  const id = useSearchParams().get('id');
  const [data, setData] = useState(null);
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
       setIsLoading(true);
       const response = await getPolicyById(id);
      console.log('response', response);
      if(response.success) {
        setData(response.data);
        const jsonContent = parseToEditorJS(response.data.docs)
        setContent(jsonContent);
        window.scrollTo(0, 0);
      } else {
        toast.error(response.error);
      }
     } catch (error) {
      console.log('error',error)
     }finally{
      setIsLoading(false);
     }
    };
  //  if(isReady) {
    fetchData();
  //  }
  }, [id]);
  const onSubmit = () => {

  }
  return (
    <div>
      {/* <h1>Policy Details</h1> */}
      {
        isLoading ? <div className="flex items-center justify-center h-full">
          <DocSkeleton />
        </div> :  <EditorForm data={content}  />
      }

    </div>
  )
}