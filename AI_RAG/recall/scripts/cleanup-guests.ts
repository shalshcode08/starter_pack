import "dotenv/config";
import { deleteStaleGuests } from "../lib/demo";

async function main() {
  const hours = Number(process.argv[2] ?? 24);
  const count = await deleteStaleGuests(hours);
  console.log(`Deleted ${count} guest user(s) older than ${hours}h.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
