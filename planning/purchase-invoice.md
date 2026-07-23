Product Requirements Document (PRD): Purchase Invoice
1. Overview
The Purchase Invoice feature is a module designed to allow users to record, manage, and track purchase invoices. This module utilizes a Calendar UI approach so that users can easily visualize invoice data based on transaction dates. The system separates the workflow and routing access between two user roles: Admin and Member.
2. UI/UX Guidelines
💡 Important Design Note:
"This UI is similar to the UI on the @absen page."
(Front-End and UI/UX teams are expected to use calendar components, layout, styling, and interactions aligned with the existing attendance page to maintain design system consistency).
3. User Roles
There are two main roles with access to this feature:
	1.	Admin: Has access to a dedicated Admin page to view the overall calendar and perform CRUD (Create, Read, Update, Delete) actions on Purchase Invoice data.
	2.	Member: Has access to the Member front-end page to view the Purchase Invoice calendar and create new entries.
4. User Flow & Pages
4.1. Admin Flow
A. Admin Calendar UI
•	URL/Endpoint: http://localhost:3000/admin/purchase-invoice/
•	Description: Displays the calendar interface containing purchase invoice data for the Admin.
•	Display Criteria: The system will render compact data (Render Compact data) on each date cell in the calendar. The displayed text consists of Title + Short description.
B. Admin CRUD Form Page
•	URL/Endpoint: http://localhost:3000/admin/purchase-invoice/create
•	Description: Form page for Admin to create or manage purchase invoice data.
•	Form Input Fields:
•	Date: Choose Date or Today (Select a specific date or automatically use today's date).
•	Title: Text input for the invoice title.
•	Description: Textarea input for detailed invoice description.
•	image_url: Field to upload or provide an image URL for the invoice proof.
4.2. Member Flow
A. Member Calendar UI
•	URL/Endpoint: localhost:3000/purchase-invoice
•	Description: Displays the purchase invoice calendar interface specifically for Members.
•	Display Criteria: Similar to the Admin side, the system will render compact data (Title + Short description) inside the calendar boxes.
B. Create Purchase Member Form
•	URL/Endpoint: localhost:3000/purchase-invoice/create
•	Description: Form page for Members to input new purchase invoice data.
•	Form Input Fields:
•	Date: Choose Date or Today (Select a specific date or today).
•	Title: Text input for the title.
•	Description: Textarea input for description.
•	image_url: Field to upload or provide an image URL for the invoice proof.
5. Database Schema
To support this module, all data will be stored in a table with the following structure:

Table Name: tb_purchaseinvoice

Field / Column Name	Data Type	Description & Function
id	-	Primary Key acting as a unique identifier for each invoice record.
invoice_date	Date	Crucial for mapping to the calendar. Used as the primary reference date to render the invoice entry on the Calendar UI.
title	String	Stores the title of the purchase invoice.
description	Text	Stores detailed descriptions, notes, or item breakdowns of the invoice.
image_url	String	Stores a string pointing to the image file hosted in cloud storage (points to your cloud storage).
created_at	Timestamp	Automatic timestamp recording when the entry was created in the system.