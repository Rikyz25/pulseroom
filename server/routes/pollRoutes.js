const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");


// ==============================
// CREATE POLL
// ==============================
router.post("/", async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        error: "Question and at least 2 options are required.",
      });
    }

    const creatorToken = crypto.randomBytes(24).toString("hex");

    const newPoll = await prisma.poll.create({
      data: {
        question,
        isClosed: false,
        creatorToken,
        options: {
          create: options.map((text) => ({
            text,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    res.status(201).json({
      message: "Poll created successfully.",
      roomId: newPoll.id,
      creatorToken,
      shareLink: `http://localhost:5173/room/${newPoll.id}`,
    });
  } catch (error) {
    console.error("Create Poll Error:", error);
    res.status(500).json({
      error: "Server error while creating poll.",
    });
  }
});


// ==============================
// GET POLL BY ID
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const poll = await prisma.poll.findUnique({
      where: { id: req.params.id },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        }
      }
    });

    if (!poll) {
      return res.status(404).json({ error: "Poll not found." });
    }

    res.json(poll);
  } catch (error) {
    console.error("Fetch Poll Error:", error);
    res.status(500).json({ error: "Server error." });
  }
});



// ==============================
// VOTE
// ==============================
router.post("/:id/vote", async (req, res) => {
  try {
    const { optionId } = req.body;
    const pollId = req.params.id;

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
    });

    if (!poll) {
      return res.status(404).json({ error: "Poll not found." });
    }

    if (poll.isClosed) {
      return res.status(400).json({ error: "Poll is closed." });
    }

    // Get voter IP
    const voterIp =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    // Check if already voted (anti-abuse)
    const existingVote = await prisma.vote.findFirst({
      where: {
        pollId,
        voterIp,
      },
    });

    if (existingVote) {
      return res.status(400).json({
        error: "You have already voted on this poll.",
      });
    }

    await prisma.vote.create({
      data: {
        pollId,
        optionId,
        voterIp,
      },
    });

    res.json({ message: "Vote recorded successfully." });
  } catch (error) {
    console.error("Vote Error:", error);
    res.status(500).json({ error: "Failed to vote." });
  }
});


// ==============================
// CLOSE POLL (Creator Only)
// ==============================
router.post("/:id/close", async (req, res) => {
  try {
    const { creatorToken } = req.body;
    const pollId = req.params.id;

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
    });

    if (!poll) {
      return res.status(404).json({ error: "Poll not found." });
    }

    if (poll.creatorToken !== creatorToken) {
      return res.status(403).json({
        error: "Unauthorized. Only creator can close this poll.",
      });
    }

    await prisma.poll.update({
      where: { id: pollId },
      data: {
        isClosed: true,
      },
    });

    res.json({ message: "Poll closed successfully." });
  } catch (error) {
    console.error("Close Poll Error:", error);
    res.status(500).json({ error: "Failed to close poll." });
  }
});

module.exports = (io) => {
  router.post("/:id/vote", async (req, res) => {
    try {
      const { id } = req.params;
      const { optionId } = req.body;

      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

      await prisma.vote.create({
        data: {
          pollId: id,
          optionId,
          voterIp: ip,
        },
      });

      // 🔥 Emit real-time update
      const updatedPoll = await prisma.poll.findUnique({
        where: { id },
        include: {
          options: {
            include: { votes: true },
          },
        },
      });

      io.to(id).emit("pollUpdated", updatedPoll);

      res.json({ message: "Vote recorded." });
    } catch (err) {
      res.status(400).json({ error: "Already voted." });
    }
  });

  return router;
};

