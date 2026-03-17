import app from './app.js';
import connectDB, { disconnectDB } from './config/db.js';
import env from './config/env.js';

const port = Number(process.env.PORT || env.PORT || 5000);
let server;
let isShuttingDown = false;

const shutdown = async (signal, exitCode = 0) => {
	if (isShuttingDown) {
		return;
	}

	isShuttingDown = true;
	console.log(`[API] Received ${signal}. Starting graceful shutdown...`);

	const forceExitTimer = setTimeout(() => {
		console.error('[API] Forced shutdown after timeout');
		process.exit(1);
	}, 10_000);

	forceExitTimer.unref();

	try {
		if (server) {
			await new Promise((resolve) => {
				server.close(resolve);
			});
		}

		await disconnectDB();
	} catch (error) {
		console.error(`[API] Shutdown error: ${error.message}`);
		process.exit(1);
	}

	process.exit(exitCode);
};

process.on('unhandledRejection', (reason) => {
	console.error('[API] Unhandled Rejection:', reason);
	shutdown('unhandledRejection', 1);
});

process.on('uncaughtException', (error) => {
	console.error('[API] Uncaught Exception:', error);
	shutdown('uncaughtException', 1);
});

process.on('SIGINT', () => {
	shutdown('SIGINT');
});

process.on('SIGTERM', () => {
	shutdown('SIGTERM');
});

const startServer = async () => {
	await connectDB();

	server = app.listen(port, () => {
		console.log(`Server started on port ${port}`);
	});
};

startServer().catch((error) => {
	console.error(`[API] Failed to start: ${error.message}`);
	process.exit(1);
});
