import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const createUser = asyncHandler(async (req, res) => {
  console.log("### ### ### creating a user ### ### ### ");

  let { email } = req.body;
  const userExist = await prisma.user.findUnique({ where: { email: email } });
  console.log(userExist);
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

export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;


  console.log("##################");
  console.log(email);

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residency is already booked by you" });
    } else {
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
    }
    res.send("your visit os book succesfully");
  } catch (err) {
    throw new Error(err.message);
  }
});
