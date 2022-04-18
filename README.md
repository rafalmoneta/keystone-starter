# Keystone 6 Blog starter with Image support

A simple example project showing how one might develop and deploy a simple KeystoneJS 6 backend to Digital Ocean.

If you haven't heard about [Keystone](https://keystonejs.com), it's a powerful GraphQL-based headless CMS, written in TypeScript
It has some terrific features out of the box, is easy to extend, and a joy to use.
There's [documentation](https://keystonejs.com/docs) covering all the
[APIs](https://keystonejs.com/docs/apis) and
[field types](https://keystonejs.com/docs/apis/fields) used in this project, as well as
[guides](https://keystonejs.com/docs/guides) to take you further. (copied from Keystone repositiory)


## What does this starter include?

### Image Support

You can upload and delete image localy (normaly Keystone don't support deleting image from you directory - we made a simple snipet to delete image after we delete item or just change image). In order to use image localy clone "main" branch. 

You can also upload and delete image while using Cloudinary (again, Keystone doesn't support deleting images directly from you cloud - we fixed that). In order to use Cloudinary Image instead of local image just clone repository on "cloudinary" branch.

### Gallery and Image Component in Document Fields

Using modified version of @justiss [keystone6-document-gallery-block](https://github.com/jutiss/keystone6-document-gallery-block) for managing Image. Created two components Image (for one single image) or Gallery (for multiple image). They both work with the Cloudinary Images (cloudinary branch) and with the local images (main branch).

### Basic role and permission

Create your own roles based on current permissions. Also, the first user will be a super admin.

## How to Use This Repo

There are different ways to approach this repo depending on what you're trying to achieve: