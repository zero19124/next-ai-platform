import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export const incrementApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId: userId },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userId: userId, count: 1 },
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });

  if (!userApiLimit || userApiLimit.count < userApiLimit.maxFreeCount) {
    return true;
  } else {
    return false;
  }
};
export type TApiLimitCount =
  | {
      count: number;
      maxFreeCount: number;
    }
  | undefined;
export const getApiLimitCount = async () => {
  const { userId } = auth();

  if (!userId) {
    return undefined;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });
  // console.log(userApiLimit, "userApiLimit");
  if (!userApiLimit) {
    return undefined;
  }

  return { count: userApiLimit.count, maxFreeCount: userApiLimit.maxFreeCount };
};
