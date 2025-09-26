if (!cuser) {
  await prisma.user.create({
    data: {
      clerkId,
      email: user.emailAddresses?.[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      role: "EMPLOYEE",
    },
  });
  // Optionally, fetch again or reload
  redirect("/protected/dashboard/employee");
  return;
}