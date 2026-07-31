<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #c3102e;">New Contact Form Submission</h2>

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 150px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ $contact->name }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a
                        href="mailto:{{ $contact->email }}">{{ $contact->email }}</a></td>
            </tr>
            @if ($contact->phone)
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ $contact->phone }}</td>
                </tr>
            @endif
            <tr style="vertical-align: top;">
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Message:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">{{ nl2br(e($contact->message)) }}</td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold;">Submitted At:</td>
                <td style="padding: 10px;">{{ $contact->created_at->format('F j, Y, g:i a') }}</td>
            </tr>
        </table>

        <p style="margin-top: 20px; color: #666; font-size: 12px;">
            This message was sent from the contact form on your website.
        </p>
    </div>
</body>

</html>
