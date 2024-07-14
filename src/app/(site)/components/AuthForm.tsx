"use client";

import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";

import { useCallback, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios"
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type Variant = "LOGIN" | "REGISTER";

function AuthForm() {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [loading, setLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);

    if (variant === "REGISTER") {
      axios.post("api/register", data)
      .catch(() => {
        toast.error("Something went wrong!")
      })
      .finally(() => {
        setLoading(false);
        toast.success("Register Successfully")
      })
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false
      })
      .then((callback) => {
        if(callback?.error){
          toast.error("Invalide credentials");
        }

        if(callback?.ok && !callback?.error){
          toast.success("Logged In!");
        }
      })
      .finally(() => setLoading(false))
    }
  };

  const socialAction = (action: string) => {
    setLoading(true);
    signIn(action, {redirect: false})
    .then((callback) => {
      if(callback?.error){
        toast.error("Invalid Credentials");
      }

      if(callback?.ok && !callback?.error){
        toast.success("Logged In!")
      }
    })
    .finally(() => setLoading(false))
  };

  return (
    <div
      className="
            mt-8
            sm:mx-auto
            sm:w-full
            sm:max-w-md
        "
    >
      <div
        className="
                bg-white
                px-4
                py-8
                shadow
                sm:rounded-lg
                sm:px-10
            "
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              register={register}
              disabled={loading}
              errors={errors}
            />
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            register={register}
            errors={errors}
            disabled={loading}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={loading}
          />

          <div>
            <Button disabled={loading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div
              className="
                absolute
                inset-0
                flex
                items-center
            "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>

        <div
          className="
            flex
            gap-2
            justify-center
            text-sm
            mt-6
            px-2
            text-gray-500
          "
        >
          <div>
            {variant === "LOGIN"
              ? "New to MessageKro?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
