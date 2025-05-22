const { ApiLog } = require('../models');

/**
 * @swagger
 * /api/auth/logs:
 *   get:
 *     tags: [Logs]
 *     summary: Get API logs (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of API logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       method:
 *                         type: string
 *                       path:
 *                         type: string
 *                       requestData:
 *                         type: object
 *                       responseData:
 *                         type: object
 *                       duration:
 *                         type: integer
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       403:
 *         description: Access denied - Admin only
 */
exports.getLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const logs = await ApiLog.findAndCountAll({
            limit,
            offset,
            order: [['timestamp', 'DESC']]
        });

        res.status(200).json({
            logs: logs.rows,
            total: logs.count,
            page,
            totalPages: Math.ceil(logs.count / limit)
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};