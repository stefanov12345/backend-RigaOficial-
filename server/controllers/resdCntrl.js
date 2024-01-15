import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    images,
    userEmail,
  } = req.body.data;

  console.log(req.body.data);

  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        images,
        owner: { connect: { email: userEmail } },
      },
    });

    res.send({ messege: "residency created succesfully" });
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("A residency with addrees already there ");
    }
    console.log(`############ ${err.message}` )
    throw new Error(err.message);
  }
});

// funcion para tener todas lso documentos de residencias.

 export const getAllResidencies = asyncHandler( async( req, res) => {
  const residencies = await prisma.residency.findMany({
    orderBy:{
      createdAt:"desc",
    },
  });
  res.send(residencies);
});

// funcion para tener documentos especificos/residency
export const getResidency= asyncHandler(async(req, res)=>{
  const {id} = req.params;
  try{
 const resdincy  = await prisma.residency.findUnique({
  where:{id}

 });
 res.send(resdincy);
  }catch(err){
    throw new Error(err.message);

 }

})
