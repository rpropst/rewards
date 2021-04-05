module.exports = mongoose => {
  const Account = mongoose.model(
    "account",
    mongoose.Schema(
      {
        customerId: Number,
        rewardsId: Number,
        points: Number,
        status: String
      },
      { timestamps: true }
    )
  );

  return Account;
};