# Centralized Better auth instance with preconfigured plugins

## Use case
Users that want to migrate to better auth but can't implement an authentification service on their own. Alternatives would be similar to keycloak, authentik and others. Although these alternatives exist, better auth provides many plugins and a great ecosystem to build off of.

## Components
better-auth server: Authentification platform configured and implemented through better-auth
console: Frontend application for managing the authentification service.
cli: Scripts and commands for managing the service remotely.
database integrations: Should match better-auth database offering.

# Scope

## Full project
The project is thought to be deployable through the git repository or through docker. Instructions should be added on how to do both, and when needed there may be more specific installation methods added.

## Better Auth Server
The better auth server should be parameterized as much as possible. Any flexibility should be done through these paramters. Changes to the source code could be made in the case of more flexibility. That said, changes in this repo will be for the community not individuals.

The server should have the following features and plugins, support given in the order that they appear:
 - [x] Basic Server Setup: Email/Password login and signup
 - [ ] Social providers: Parameterized enable for built-in social providers
 - [x] Organization https://better-auth.com/docs/plugins/organization
 - [x] Admin https://better-auth.com/docs/plugins/admin
 - [x] Open API https://better-auth.com/docs/plugins/open-api
 - [ ] Username https://better-auth.com/docs/plugins/username
 - [ ] OAuth 2.1 Provider https://better-auth.com/docs/plugins/oauth-provider
 - [ ] JWT https://better-auth.com/docs/plugins/jwt
 - [ ] API Keys https://better-auth.com/docs/plugins/api-key
 - [ ] Anonymous https://better-auth.com/docs/plugins/anonymous
 - [ ] Configurable Rate limiting https://better-auth.com/docs/concepts/rate-limit
 - [ ] Stripe https://better-auth.com/docs/plugins/stripe
 - [ ] Single Sign-On (SSO) https://better-auth.com/docs/plugins/sso
 - [ ] Generic OAuth https://better-auth.com/docs/plugins/generic-oauth
 - [ ] Audit Logs (Not from infra, custom implementation)
 - [ ] Dashboard (Not from infra, custom implementation)
 - [ ] Polar https://better-auth.com/docs/plugins/polar

## Better Auth Console
Frontend application with its own login page to access. Should use default organization to access.

The frontend application should mirror the plugins that are added. Initially it should show organizations, and in each its accounts and sessions. It should also be able to overwrite scopes (not manage them).

As the application progresses it should be able to modify the parameters mentioned in the server side. Such as the following:
 - [ ] Enable social providers
 - [ ] Create new organizations
 - [ ] Create new users/add to organizations
 - [ ] Create and manage roles in organizations (admin to start)
 - [ ] View dashboard (Not from infra, custom implementation)
 - [ ] Audit Logs (Not from infra, custom implementation)
 - [x] Access OpenAPI

More features should be considered and added as the plugins are finished in the server side.

## CLI
Create temporary admin users, database dumps for backups, restores and database migrations. For now this is the scope for the CLI scripts.

## Database Integration
Should be tested for postgres, but should support all of the databases better-auth supports.
 - [ ] MySQL
 - [x] SQLite
 - [ ] PostgreSQL
 - [ ] MS SQL
 - [ ] All dialects supported by [Kysely](https://better-auth.com/docs/adapters/other-relational-databases)

Currently we will not be prioritizing ORM since this does not change anything in the application.

