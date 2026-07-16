import { NextPage } from "next";
import React from "react";
import Head from "next/head";
import ProjectValidation from "../../components/ProjectValidation";

const ValidationPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Project Validation | Agent K9</title>
        <meta
          name="description"
          content="Validate your project and gain community trust through our comprehensive verification process"
        />
      </Head>
      <ProjectValidation />
    </>
  );
};

export default ValidationPage;
