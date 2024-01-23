<?php

class Bd_Idc
{
	/**
	 * We only support the two idc rooms: jx & tc
	 */
	protected static $available_idc_rooms = array('jx', 'tc');

	/**
	 * Get the current idc room name
	 *
	 * @param string $default if the idc room info is not available return the default room name
	 *
	 * @return string
	 */
	public static function getCurrentIdcRoomOrDefault($default)
	{
		if ($default && !in_array($default, self::$available_idc_rooms)) {
			throw new Exception("Default room name: $default is not available, we only have rooms: " . implode(",", self::$available_idc_rooms));
		}

		if (isset($_SERVER['X_BD_IDC']) && ($idc = strtolower($_SERVER['X_BD_IDC']))) {
			if (!in_array($idc, self::$available_idc_rooms)) {
				// TODO move to Bd_Log?
				trigger_error("Got wrong idc room name from header: $idc, we only support rooms: "
					. implode(",", self::$available_idc_rooms) . ". Use default room: $default instead", E_USER_WARNING);
				$idc = $default;
			}
		} else  {
			$idc = $default;
		}

		return $idc;
	}

	/*
	 * TODO eg: jx, ai, tc, db, but now it not available
	 */
	public static function getCurrentIdcName()
	{
	}
}
