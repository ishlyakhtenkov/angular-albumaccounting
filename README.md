Album Accounting System project 
=================================

This is the frontend part of Album Accounting System designed for accounting constructor documentation albums, stored in the archive, and for tracking which employee has the constructor documentation album at the moment.

### Technology stack used: 
* Angular 2
* Bootstrap

### Project key logic:
* System main purpose: accounting constructor documentation albums, stored in the archive; obtaining information about the location of a specific album of constructor documentation at the moment.
* There are 3 types of users: admin, archive worker and anonymous users.
* Admins can create/update/delete users, departments, employees and albums.
* Archive workers can create/update/delete employees and albums. Also they can change their profile password.
* Anonymous users can only view information about albums.
* An archive worker, when issuing an album to the employee, enters the relevant information into the system.
* An archive worker, when the employee returns the album to the archive, enters the relevant information into the system.
