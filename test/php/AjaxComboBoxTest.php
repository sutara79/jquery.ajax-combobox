<?php
use PHPUnit\Framework\TestCase;
use myapp\AjaxComboBox;

/**
 * @coversDefaultClass myapp\AjaxComboBox
 */
final class AjaxComboBoxTest extends TestCase
{
    /**
     * @covers ::connectDB
     */
    public function testCanBeCreatedFromUserInput()
    {
        $sqlite = array(
          'dsn'      => 'sqlite:./sample/sample.sqlite3',
          'username' => '',
          'password' => ''
        );
        $obj = AjaxComboBox::connectDB($sqlite);
        $this->assertInstanceOf('PDO', $obj);
    }
}
