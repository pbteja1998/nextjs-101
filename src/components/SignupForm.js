import { Cross, Loading } from "@icons/index";
import classNames from "classnames";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

const ErrorMessage = ({ message }) => (
  <p className="text-sm px-3 mt-1 text-red-500 inline-block">{message}</p>
);

const SignupForm = ({ title, isSlim }) => {
  // front end validation with react-hook-form
  // prevent submitting invalid or empty emails
  const { register, errors, handleSubmit, reset } = useForm();

  // subscribe
  const subscribe = async (email) => {
    const res = await fetch(`/api/subscribe?email=${email}&tags=1980921`);
    if (!res.ok) throw "There was an error subscribing to the list.";
  };

  // react query mutation that will call our API route
  const [
    mutate,
    { isLoading, isSuccess, reset: resetMutation, isError, error },
  ] = useMutation(({ email }) => subscribe(email));

  // handle form submit
  const onSubmit = (data) => mutate(data);

  // reset form on success
  useEffect(() => {
    reset();
  }, [isSuccess]);

  // css classes for our UI
  const subWrapperClass = classNames({
    "p-4 border border-blue-300 bg-blue-100 mb-4 md:mb-8 md:p-8": isSlim,
  });

  const formClass = classNames({
    "w-full": true,
    "max-w-sm": !isSlim,
  });

  const innerFormClass = classNames({
    "flex items-center border rounded-md border-gray-300 p-1 bg-white focus-within:border-blue-500 focus-within:ring-blue-200 focus-within:ring-4": true,
    "bg-gray-100 border-gray-100": isLoading,
  });

  const inputClass = classNames({
    "appearance-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none": true,
    "opacity-50 cursor-not-allowed": isLoading,
  });

  const btnClass = classNames({
    "flex-shrink-0 bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-sm border-4 text-white py-1 px-2 rounded inline-flex ": true,
    "disabled:opacity-75 cursor-not-allowed": isLoading,
  });

  const successClass = classNames({
    "p-3 pr-1 bg-green-100 border border-green-400 text-success inline-flex": true,
    "text-sm rounded-md ": !isSlim,
    "w-full my-4 md:my-8 p-8 md:text-md rounded-none": isSlim,
  });

  // if success show confirmation message instead of the form
  if (isSuccess) {
    return (
      <div className={successClass}>
        <span>Success. Check your inbox and confirm your email.</span>
        <span className="self-center flex mr-1">
          <button
            onClick={() => resetMutation()}
            className="bg-success text-white rounded-full h-4 w-4 mt-auto ml-1 hover:bg-red-500 transition-colors duration-200"
          >
            <Cross className="h-2 w-2 mx-auto" />
          </button>
        </span>
      </div>
    );
  }

  return (
    <div className={subWrapperClass}>
      <p className="p-1 mb-2">{title}</p>
      <form className={formClass} onSubmit={handleSubmit(onSubmit)}>
        <div className={innerFormClass}>
          <div className="flex flex-col w-full">
            <input
              className={inputClass}
              type="text"
              name="email"
              disabled={isLoading}
              ref={register({
                required: "Email is required.",
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: "Please enter a valid email.",
                },
              })}
              placeholder="Jane Doe"
              aria-label="Full name"
            />
          </div>

          <button className={btnClass} disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                <Loading className="animate-spin h-5 w-5 mr-3" />
                Processing
              </>
            ) : (
              <>Sign Up</>
            )}
          </button>
        </div>
        {errors.email && <ErrorMessage message="Please enter a valid email." />}
        {isError && <ErrorMessage message={error} />}
      </form>
    </div>
  );
};

export default SignupForm;
