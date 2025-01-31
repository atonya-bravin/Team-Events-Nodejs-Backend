import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

const createGroup = (req: Request, res: Response) => {};

const getUserGroups = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        user_group: {
          include: {
            group: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userGroups = user.user_group.map((userGroup) => userGroup.group);

    res.status(200).json({
      message: "User groups fetched successfully",
      userGroups,
    });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getGroupById = (req: Request, res: Response) => {};

const getGroupEvent = (req: Request, res: Response) => {};

export { createGroup, getGroupById, getGroupEvent, getUserGroups };
