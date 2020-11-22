#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

case "$1" in
	start)
		if ! (screen -list | grep -q "t3mpl_server"); then
			screen -dmS t3mpl_server sh
			screen -S t3mpl_server -X stuff "cd ../
"
			screen -S t3mpl_server -X stuff "npm run serve:prod
"
			echo "Server has started"
		else
			echo "Server already running"
		fi
	;;

	stop)
		if (screen -list | grep -q "t3mpl_server"); then
			screen -X -S t3mpl_server quit
			echo "Server has stopped"
		else
			echo "Server is not running"
		fi
	;;

	*)
		echo "Usage:"
		echo "- bash screen-server.sh start"
		echo "- bash screen-server.sh stop"
		exit 1
		;;
esac

exit 0
