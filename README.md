# bookstore

## Installation
#### Step 1: Clone the repository

```bash
git clone https://github.com/danoseun/bookstore
cd bookstore
```

#### Step 2: Setup database
Create a new postgres database

#### Step 3: Setup environment variables
Include necessary variables as found in .env.sample into .env 

#### Step 4: Install NPM packages
```bash
npm i
```

#### Step 5: Start in development mode
```bash
npm run dev
```

#### Step 6: Make database migration and seed data
```bash
npm run migrate
npm run seed
```

## Testing
```bash
npm test
```
## ASSUMPTIONS
- To save time, some users have been seeded into the db so users can only login currently as there's no ability to create account.
- Redis was used to store user carts.
- We have assumed that there are no admins.
- Some APIs have been protected to mirror real life cases better

## REQUIREMENTS NOT COVERED
- Only a single item(object) can be added to the update cart endpoint

## IMPROVEMENTS
- More tests could have been written.
- Redis store for carts could have been made better with sessions configured along side
- Error logging could be better for production based code.
- More validations could have been considered as well depending on several edge/ use cases.