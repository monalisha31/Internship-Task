# Internship-Task
Atlan Backend Challenge

## Task 1

One of our clients wanted to search for slangs (in local language) for an answer to a text question on the basis of cities (which was the answer to a different MCQ question)

Solution:

My approach was to create a middleware that will use the google translate API for language conversion.

## Task 2

A market research agency wanted to validate responses coming in against a set of business rules (eg. monthly savings cannot be more than monthly income) and send the response back to the data collector to fix it when the rules generate a flag 

Solution:

My approach was to create a sample database and a middleware that will validate all the records based on the database using queries. 

## Task 3

A very common need for organizations is wanting all their data onto Google Sheets, wherein they could connect their CRM, and also generate graphs and charts offered by Sheets out of the box. In such cases, each response to the form becomes a row in the sheet, and questions in the form become columns. 

Solution: 

My approach was to create a middleware that will the export the database and save it in the csv format in the static folder.

## Task 4

A recent client partner wanted us to send an SMS to the customer whose details are collected in the response as soon as the ingestion was complete reliably. The content of the SMS consists of details of the customer, which were a part of the answers in the response. This customer was supposed to use this as a “receipt” for them having participated in the exercise.

Solution:

My approch was to use fast-two-sms lib to send sms to the customers based the database records.

