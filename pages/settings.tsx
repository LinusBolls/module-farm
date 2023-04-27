import axios from "axios";
import React, { ChangeEvent, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";


type FormData = {
  avatar: FileList;
};

const AvatarUpload: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<FormData>();
  const mutation = useMutation(async (formData: FormData) => {
    const fileData = new FormData();

    fileData.append('file', formData.avatar[0]);

    const res = await axios.post("/api/files/avatars", fileData);
  
    alert(JSON.stringify(res.data));
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await mutation.mutateAsync(data);
        // Handle success
      } catch (error) {
        // Handle error
      }
    },
    [mutation]
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        // You can add your own logic to handle image preview, e.g. setting a state with the image src.
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="avatar">Upload Avatar:</label>
      <input
        id="avatar"
        type="file"
        accept="image/*"
        {...register("avatar", { required: true })}
        onChange={handleFileChange}
      />
      <button type="submit" disabled={formState.isSubmitting || mutation.isLoading}>
        Submit
      </button>
    </form>
  );
};



function Page() {


  // const { data: selfInfo, isLoading: isLoadingSelfInfo, error: selfInfoError } = useQuery(['self-info'], async () => {
  //   const res = await axios.get("/api/me")

  //   return res.data.data
  // });

  // if (isLoadingSelfInfo) return "loading..."

  return <div>
    <AvatarUpload />
  </div>
}
export default Page
