import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const createUser = asyncHandler(async (req, res) => {
  console.log("### ### ### creating a user ### ### ### ");
  
  let { email } = req.body;
  const userExist = await prisma.user.findUnique({ where: { email: email } });
  console.log(userExist)
  if (!userExist) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      mesagge: "user registred sucessfully",
      user: user,
    });
  } else {
    res.send(201).json({
      message: " user already register",
    });
  }
});
