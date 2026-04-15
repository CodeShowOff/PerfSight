import connectDB, { disconnectDB } from '../config/db.js';
import User from '../modules/users/users.model.js';
import Metric from '../modules/metrics/metrics.model.js';
import Perf from '../modules/perf/perf.model.js';
import Analysis from '../modules/analysis/analysis.model.js';
import Regression from '../modules/regression/regression.model.js';
import Report from '../modules/report/report.model.js';

const ORPHAN_FILTER = {
  $or: [{ user: { $exists: false } }, { user: null }],
};

const pickTargetUser = async () => {
  const explicitUserId = process.env.BACKFILL_USER_ID || process.argv[2];

  if (explicitUserId) {
    const user = await User.findById(explicitUserId).select('_id name email').lean();
    if (!user) {
      throw new Error(`Target user not found for id: ${explicitUserId}`);
    }
    return user;
  }

  const users = await User.find({}).select('_id name email').lean();

  if (users.length === 0) {
    throw new Error('No users found. Cannot backfill ownership.');
  }

  if (users.length > 1) {
    throw new Error(
      `Found ${users.length} users. Re-run with BACKFILL_USER_ID or pass a user id as the first argument.`
    );
  }

  return users[0];
};

const backfillModel = async (name, Model, userId) => {
  const before = await Model.countDocuments(ORPHAN_FILTER);

  if (before === 0) {
    return {
      model: name,
      before,
      matched: 0,
      modified: 0,
      after: 0,
    };
  }

  const result = await Model.updateMany(ORPHAN_FILTER, {
    $set: { user: userId },
  });

  const after = await Model.countDocuments(ORPHAN_FILTER);

  return {
    model: name,
    before,
    matched: result.matchedCount || 0,
    modified: result.modifiedCount || 0,
    after,
  };
};

const main = async () => {
  await connectDB();

  const user = await pickTargetUser();
  const userId = user._id;

  console.log(
    `[Backfill] Assigning orphaned records to user: ${user.name} <${user.email}> (${userId})`
  );

  const summary = [];
  summary.push(await backfillModel('Metric', Metric, userId));
  summary.push(await backfillModel('Perf', Perf, userId));
  summary.push(await backfillModel('Analysis', Analysis, userId));
  summary.push(await backfillModel('Regression', Regression, userId));
  summary.push(await backfillModel('Report', Report, userId));

  console.table(summary);

  const totalUpdated = summary.reduce((sum, item) => sum + item.modified, 0);
  console.log(`[Backfill] Completed. Total updated documents: ${totalUpdated}`);
};

main()
  .catch((error) => {
    console.error(`[Backfill] Failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
