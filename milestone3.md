Milestone 3: Full Functional Integration and App Completion Guide

Objective:
Make the dating app fully functional, connect all features into one flow, ensure proper Firestore and Storage integration, implement matching and messaging logic, set up subscription restrictions, verification badge system, Stripe integration, reporting and blocking functionality, core notifications, and finalize UI polish. Also, the AI dev should review the entire app flow and fix or implement anything missing so the app behaves like a real working dating app.

AI Developer Instructions

1. Swipe and Match Functionality
• Implement real swipe left and swipe right gesture actions.
• When both users like each other, create a Match record in [matches] collection.
• Each match entry should include both userIds, timestamp, and matchId.
• Show the “It’s a Match” popup after mutual swipe.
• Add Match List screen to display all matches for the logged-in user.

2. Matching Feed System
• Show profiles that match basic filters, for example, gender preference or age range.
• Prevent showing already swiped profiles.
• Pull profile pictures and details from Firestore.
• Random or simple filtered feed is acceptable at this stage.

3. Full Messaging System
• Enable real-time chat using Firestore messages collection.
• Only allow sending messages if both users are matched AND the user has an active subscription.
• Show typing indicator optional, seen indicator optional if time allows.
• Retrieve and display messages in order with timestamps.

4. Subscription Access Lock
• Connect Stripe subscription status to Firebase Authentication or Firestore user document.
• If user has subscription = allow access to chat.
• If not subscribed = block chat and show paywall screen.
• Monthly cost remains $0.99 (or as set by client later).

5. Stripe Integration Completion
• Connect provided Stripe publishable and secret keys.
• Implement test subscription purchase flow inside the app.
• Store subscription data in Firestore users profile under “subscriptionStatus”.

6. Verification Badge System
• Use selfie upload verification already set up in previous milestone.
• When admin approves, display a small Verified icon on profile, match, and chat pages.
• Make verified profiles more visible in the feed (optional if easy).

7. Block and Report Features
• Implement “Block” and “Report” buttons on profile or chat page.
• Block hides the blocked user completely.
• Report sends data to [reports] Firestore collection for admin panel review.
• Admin should be able to delete or suspend accounts.

8. Admin Panel Finalization
• Show list of users, reports, and verification requests.
• Allow admin to approve, reject, or delete accounts.
• Enable basic status indicators like active, suspended, pending verification.

9. Finalizing Database Rules
• Set Firestore Security Rules to protect users’ photos, profile data, chats, and reports.
• Ensure only matched users can read each other’s messages.
• Make storage rules for profileImages and verificationImages.

10. UI Polishing and Flow Review
• Make sure screens transition smoothly from onboarding to sign up, profile setup, swipe, match, chat.
• Apply brand design: pink and teal, rounded cards, clean friendly interface.
• Add simple animations for swipe, match popup, and screen transitions.

11. Basic Notifications (If Possible)
• Optional but recommended: use Firebase Cloud Messaging for simple push notifications for new match or new message.

12. App Flow Quality Check
• AI developer should check the entire app flow manually after integration:

Sign up, profile setup

See and swipe profiles

Get matches

Messaging locked unless subscribed

Subscribe and get access

Verified badge display

Block and report working

Admin features working

All data saving correctly

13. Fix Anything Missing
If any part of the dating app flow is broken, incomplete, or missing, it should be implemented automatically to ensure full functionality before milestone 3 ends.

14. Domain Connection Preparation
• Prepare the app for domain binding, but do not attach yet.
• Ensure everything can be linked to main domain when ready via GoDaddy.
• Final domain connection will be done after milestone 3 completion.