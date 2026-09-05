/** What one Enter may carry. The batch route's own ceiling — past it the client
    says so rather than sending a request it knows will be refused. */
export const MAX_NAMES = 20

/* `milk, cereal, chicken thighs` is three rows (Zach, live pass). The comma is
   the only separator: a space cannot be one, because "chicken thighs" is a thing
   a person buys.

   Deliberately NOT deduplicated. `milk, milk` makes two rows and the server
   reports the second as a collision — the same answer typing it twice would
   give, which is the point: the client does not get an opinion the surface would
   then have to explain. Case is preserved for the same reason; `Milk` is what
   they wrote, and `normalizeItemName` is the server's business. */
export function parseNames(input: string): string[] {
  return input
    .split(',')
    .map((name) => name.trim().replace(/\s+/g, ' '))
    .filter((name) => name.length > 0)
}
