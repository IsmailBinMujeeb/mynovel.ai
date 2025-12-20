# Here we will create a two chapter long novel with mynovel.ai

# Step 1 - Signup or login to your account.

Before you start, Frontend and backend should be ready, and you can access them at `http://localhost:5173` and `http://localhost:3000` respectively.

Click on `sign in` button on the top right corner of navbar.

Fill the credentials, It will redirect you to `/home`

# Step 2 - Create a new novel.

At `/home`, You will see all your novels and a button `New Novel`, Click on it.

Now you are at `/new/novel`, and can see `Novel Title` and `Novel Plot` input fields, Fill them with:

## Novel Title
```txt
A Nightmare
```

## Novel Plot
```txt
Anya’s thirteenth birthday, April 13th, initiates a series of increasingly vivid and terrifying nightmares. These nightmares aren’t random; they are deliberately inflicted.

The source of the nightmares is Lyra, a centuries-old entity—formerly human—with a deep-seated, justified grievance against humanity. Lyra’s original life was destroyed by human actions (historical event revealed through flashbacks). She now exists in a liminal state, able to influence the dreamscape.

Anya is not a random target. She is a descendant of individuals directly involved in Lyra’s past trauma, making her uniquely susceptible to Lyra’s influence. This connection is initially unknown to Anya.

The nightmares begin subtly, psychological horror, then escalate to physically manifesting fears and threats. Each nightmare weakens Anya, and simultaneously, Lyra gains strength, preparing for a larger, real-world impact.

Anya’s boyfriend, Ethan, provides emotional support but becomes increasingly concerned as Anya deteriorates. His skepticism initially clashes with Anya’s growing conviction that the nightmares are not merely dreams. Ethan’s investigation into Anya’s claims inadvertently draws Lyra’s attention to him, placing him in danger.

A side character, Dr. Eleanor Vance, a sleep specialist, attempts to diagnose Anya’s condition scientifically, initially dismissing the supernatural element. Dr. Vance’s research uncovers historical patterns mirroring Anya’s nightmares, hinting at a larger, cyclical phenomenon.

Plot Twist 1: Dr. Vance discovers a hidden family history connecting Anya to a specific event in Lyra’s past.

Lyra’s ultimate goal isn’t simply to torment Anya, but to unleash a psychic plague—amplified by Anya’s lineage—that will induce widespread nightmares and chaos, ultimately crippling humanity. The nightmares are a testing ground, a means of refining her attack.

The stakes escalate as people around Anya begin experiencing similar, though less intense, nightmares, indicating Lyra’s power is spreading.

Anya learns to consciously enter her nightmares, discovering a distorted dream realm where she can confront Lyra. These dream confrontations are dangerous, blurring the line between reality and illusion.

Plot Twist 2: Ethan is revealed to possess a latent psychic ability, inherited from a distant ancestor, making him a potential key to defeating Lyra, but also a greater target.

Anya, with Ethan’s help and Dr. Vance’s research, uncovers the specific act that triggered Lyra’s transformation and the method to sever the connection. This requires a dangerous ritual within the dream realm, confronting Lyra at her source.

The climax involves a final, harrowing confrontation within the dreamscape. Anya must use her love for Ethan and her desire for freedom from the nightmares to overcome Lyra’s power.

Lyra is defeated not through destruction, but through empathy and understanding. Anya acknowledges the pain of Lyra’s past, offering a form of closure that allows Lyra to finally find peace and relinquish her hold on the dream world.

The ending is hopeful. Anya and Ethan are safe, the psychic plague is averted, and the nightmares cease. Anya retains a heightened awareness of the dream world, using her experience to help others struggling with trauma. The final scene suggests the possibility of other entities existing in the liminal space, hinting at future stories.
```

Click on `Create Novel`.

Now you will be redirect to `/novel/overview/:novelId`.

# Step 3. Fill the novel context form.

On `/novel/overview/:id`, you will see this warning:
![screenshort_1](./assets/screenshort_1.png)

```
Before you can continue, please answer all questions which helps to improve your novel.
```

Click on `continue` button, and you will be at `/novel/context/:novelId`.

Now we have 24 questions for the context of AI to write novel, answer them all like this:

1. What genre(s) do you want? (e.g., romance, fantasy, thriller, sci-fi)
- ```txt
  Horror, Thriller
  ```

2. Any books, authors, or movies you want it to feel like?
- ```txt
  I want the feeling of Conjuring movies
  ```

3. Do you want it fast-paced or slow and detailed?
- ```txt 
  I want it to be slow paced
  ```

4. Serious, dark, humorous, or light-hearted?
- ```txt 
  Serious and dark
  ```

5. First-person or third-person narration?
- ```txt 
  The novel should be first person narrated
  ```

6. What is the main conflict or problem?
- ```txt
  A girls birthday on 13 April from age of 13 start showing her nightmares, does nightmares are not coincidence someone is trying to harm humanity
  ```

7. What themes matter to you? (love, revenge, identity, freedom, etc.)
- ```txt 
  Love and freedom from this nightmares should be centric themes
  ```

8. Do you want a happy ending, tragic ending, or open ending?
- ```txt 
  I want a happy ending
  ```

9. Who is the protagonist?
- ```txt 
  Anya
  ```

10. Age, gender, personality, strengths, flaws?
- ```txt 
  13 years old, Anya a female protagonist you can make it more better
  ```

11. Who is the antagonist (villain, rival, or opposing force)?
- ```txt 
  I don't have yet, you can create on the go
  ```

12. Any must-have side characters?
- ```txt 
  You can add or create side characters
  ```

13. Where does the story take place? (city, country, fantasy world, future?)
- ```txt 
  Depends on the scenario but most of the story be in city but can be changed if needed
  ```

14. When does it take place? (past, present, future)
- ```txt 
  the story take place in present timeline, but some events can be shown also.
  ```

15. Are there special rules? (magic, technology, social systems)
- ```txt 
  No special rules accept the nightmares
  ```

16. Should the world feel realistic or exaggerated?
- ```txt 
  the world feel realistic
  ```

17. Do you want plot twists? If yes, how shocking?
- ```txt 
  Yes! I want plot twists, and not each chapter but some times plot twisting is fine
  ```

18. How much violence is okay?
- ```txt 
  Too much is okay when needed because it is a horror story
  ```

19. Is romance included? How explicit?
- ```txt 
  Yeah, Romance between Anya and his boyfriend is okay but not too much
  ```

20. Is strong language okay?
- ```txt 
  Don't use too hard words so user leave the story instead use easy and normal words
  ```

21. Approximate word count for a single chapter? (e.g., 2k, 3k, 5k)
- ```txt 
  A single chapter must have the chapter words count of 2,500 words.
  ```

22. Can I change ideas if something doesn’t work?
- ```txt 
  Yes!
  ```

23. What emotion do you want readers to feel at the end?
- ```txt 
  The reader should feel broken on the whole story but happy when everything ends
  ```

24. If you could describe the book in one sentence, what would it be?
- ```txt 
  A story where each character is included so he/she can die later
  ```

Now click on `save`.

# Step 4. Write first chapter.

Click on `New Chapter` in the left panel, and now you will see input fields like `Chapter Title`, `Chapter Prompt` and `Chapter Number`, Fill:

## Chapter Title
```txt
Chapter One
```

## Chapter Prompt
```txt
The chapter opens in the early morning of April 13. Anaya wakes up before her alarm, noticing small, ordinary details: the pale light through the window, the sound of birds, the calendar on the wall with today’s date circled. She feels a faint heaviness in her chest but ignores it.

Most of the chapter follows Anaya’s normal birthday day. She goes to school, receives simple wishes from friends, and pretends to enjoy the attention. Nothing clearly supernatural happens, but the atmosphere feels slightly wrong. She keeps noticing small things: clocks stopping for a second, shadows stretching too long, a strange silence during the afternoon.

Anaya mentions her birthday to her grandmother (or another older figure), who pauses for a moment before forcing a smile and changing the subject. This is the first hint that April 13 matters, though no explanation is given.

In the evening, the family celebrates quietly. The cake is cut, candles are blown out, and everyone laughs, but Anaya notices that no one takes photos. When she asks why, her mother says the phone battery is dead, even though it isn’t.

At night, Anaya lies in bed, listening to the house settle. She does not have a full nightmare yet. Instead, she experiences restless sleep, half dreams, vague images of fire and rain, and the feeling that someone is standing just out of sight.

The chapter ends with Anaya waking briefly after midnight. She looks at the clock: 12:13 a.m. She hears a soft breath in the room, then nothing. When she turns over, she tells herself it’s just her imagination, but the sense of being watched does not leave.
```

## Chapter Number
```txt
1
```

Wait it will take time to start streaming soon, and then you will have a complete first chapter, do not forgot to `save`.

But to see the power of `mynovel.ai`, You should create chapter two, and see how perfectly both chapters connect with each others.

# Chapter Two

## Chapter Title
```txt
Chapter Two
```

## Chapter Prompt
```txt
The chapter begins the morning after Anaya’s birthday. She wakes feeling tired, as if she barely slept, though she cannot remember any specific dream. Her room looks normal, but she has the lingering sense that something has been moved or touched. Nothing is out of place enough to prove it.

Throughout the day, Anaya struggles with concentration. At school, familiar sounds feel distant, and she occasionally loses track of time. A teacher calls her name twice before she responds. Her friends notice she seems quieter, but she brushes it off as lack of sleep.

Small details begin to repeat. When Anaya glances at clocks, they often show 13 minutes past the hour. She assumes it’s coincidence, but the pattern unsettles her. She also begins to notice a girl in her peripheral vision—never clearly, only as a blur that disappears when she turns her head.

That night, Anaya dreams for the first time—but the dream is not violent or loud. She stands in an empty field under a dark sky. The air smells like smoke, though there is no fire. In the distance, she sees the silhouette of a girl facing away from her. No words are spoken. The girl slowly tilts her head, as if aware of Anaya’s presence.

Anaya wakes before the girl turns fully around. Her heart is racing, but there is no scream, no panic—only a deep sadness she doesn’t understand. She notices her pillow is damp, as though she has been crying in her sleep.

The chapter ends with Anaya writing the dream down in a notebook, telling herself it was meaningless. Yet as she closes the notebook, she feels certain of one thing: the dream was not random and it is not finished.
```

Enjoy it!
